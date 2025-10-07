# ⚙️ Arquitectura Backend – **Symfony 7 (PHP 8.2)**

El backend de **Delfoservas** ha sido desarrollado con **Symfony 7**, siguiendo una arquitectura limpia, desacoplada y orientada a servicios.  
Su objetivo es ofrecer una API REST sólida, segura y mantenible que gestione toda la lógica de negocio del sistema de reservas, clases y usuarios.

---

## 🧩 Estructura General

```
symfony-backend/
│
├── app/
│   ├── src/
│   │   ├── Controller/        # Endpoints principales de la API
│   │   ├── Entity/            # Entidades que representan tablas SQL
│   │   ├── Repository/        # Consultas personalizadas SQL y DQL
│   │   ├── Migrations/        # Versionado y migraciones automáticas
│   │   ├── Security/          # Autenticación JWT y roles
│   │   └── EventListener/     # Listeners para eventos de Doctrine
│   ├── config/                # Configuración YAML (JWT, Doctrine, CORS)
│   └── public/                # Punto de entrada (index.php)
└── docker/                    # Entorno Docker con PHP, Nginx y PostgreSQL
```

---

## 🧱 Entidades Principales

Las entidades representan las tablas de la base de datos y están mapeadas mediante **Doctrine ORM**.

| Entidad | Descripción | Relaciones principales |
|:--|:--|:--|
| `User` | Gestiona autenticación, roles (`ROLE_ADMIN`, `ROLE_TEACHER`, `ROLE_USER`) y datos del usuario. | 1:N con `Reservation`, 1:N con `Wallet` |
| `Clase` | Representa una clase deportiva (día, hora, aforo, profesor). | N:1 con `User` (teacher), 1:N con `Reservation` |
| `Reservation` | Vincula a un usuario con una clase y un bono. | N:1 con `User`, `Clase` y `Bonos` |
| `Bonos` | Paquete de clases del usuario (tipo, estado, clases restantes). | N:1 con `Wallet` |
| `Wallet` | Agrupa bonos del usuario por mes y tipo de clase. | 1:N con `Bonos`, N:1 con `User` |
| `TipoClase` | Catálogo de tipos de clase (Yoga, Pilates, Fisio...). | 1:N con `Clase`, 1:N con `Bonos` |
| `Room` | Espacios físicos donde se imparten las clases. | 1:N con `Clase` |

---

## 🧠 Repositorios

Cada entidad posee su propio repositorio, extendiendo `ServiceEntityRepository`.  
Sin embargo, se han desarrollado **consultas personalizadas** mediante SQL nativo para optimizar rendimiento.

📌 Ejemplos:
- `VistasRepository`: agrupa consultas SQL complejas (vistas como `vista_clases`, `vista_wallet_usuario`, etc.)
- `ClaseRepository`: consultas con agregaciones (`COUNT`, `JOIN`) para vistas de profesor.
- `ReservationRepository`: inserciones controladas para reservas con triggers SQL.

**Conexión directa a PostgreSQL:**
```php
$conn = $this->getEntityManager()->getConnection();
$sql = 'SELECT * FROM vista_clases ORDER BY fecha, hora';
return $conn->fetchAllAssociative($sql);
```

---

## 🧩 Controladores

Los controladores están organizados por dominio funcional y devuelven siempre **respuestas JSON limpias**.

| Controlador | Descripción |
|:--|:--|
| `AuthController` | Registro y login con **JWT** (LexikJWTAuthenticationBundle). |
| `ClaseController` | CRUD de clases, asignación de profesor y control de aforo. |
| `ReservationController` | Endpoints críticos de reserva con **transacciones y bloqueos FOR UPDATE**. |
| `BonosViewController` | Consultas avanzadas para obtener bonos activos y reservas por usuario. |
| `WalletController` | Gestión de monederos (wallets) – actualmente desactivado para refactor. |
| `VistasController` | Consultas optimizadas a vistas SQL de negocio. |

---

## 🧮 Endpoints Destacados

| Método | Endpoint | Descripción |
|:--|:--|:--|
| `POST` | `/api/auth/login` | Login de usuario (JWT). |
| `GET` | `/api/vistas/vistabonos/{usuarioId}` | Devuelve los bonos del usuario. |
| `GET` | `/api/vistas/usuarioreservas/{id}/reservas` | Listado de reservas del usuario. |
| `GET` | `/api/vistas/mias` | Clases asociadas al profesor autenticado. |
| `POST` | `/api/reservation/reservar/{claseId}` | Crea una reserva con verificación de aforo, bono y duplicados. |
| `DELETE` | `/api/reservation/{id}` | Cancela una reserva (devolviendo crédito al bono). |

---

## 🔒 Autenticación y Roles

Implementación basada en **LexikJWTAuthenticationBundle**:
- Generación de tokens al iniciar sesión (`/api/login_check`).
- Middleware de autenticación que valida el token JWT.
- Acceso condicionado a roles (ADMIN, TEACHER, USER).

```yaml
security:
  access_control:
    - { path: ^/api/admin, roles: ROLE_ADMIN }
    - { path: ^/api/teacher, roles: ROLE_TEACHER }
    - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

---

## 🧩 Migraciones y Esquema SQL

Toda la base de datos está gestionada con **Doctrine Migrations**, permitiendo versionar cambios y mantener coherencia entre entornos.

### 📜 Comandos frecuentes

```bash
# Crear una nueva migración
php bin/console make:migration

# Ejecutar migraciones pendientes
php bin/console doctrine:migrations:migrate

# Eliminar versiones huérfanas
php bin/console doctrine:migrations:version --delete --all
```

---

## 🧠 Triggers y Lógica en Base de Datos

El backend delega parte de la lógica al nivel SQL (PostgreSQL):
- **Trigger** `crear_bono_automatico`: genera un bono tras un pago o wallet.
- **Trigger** `restar_clase_bono`: descuenta una clase al reservar.
- **Trigger** `devolver_clase_bono`: devuelve crédito al cancelar reserva.
- **Views**: `vista_clases`, `vista_wallet_usuario`, `vista_reservas_por_usuario`.

Esto reduce la carga del backend y asegura consistencia incluso ante errores de red o concurrencia.

---

## 🧩 Testing y Herramientas

- Test manual y automatizado con **Postman** (colección completa con roles y JWT).  
- Validación de controladores con **Symfony Profiler** y logs.  
- Base de datos verificable desde **DBeaver / pgAdmin**.  
- Contenedores aislados mediante **Docker Compose**:
  ```bash
  docker compose up -d
  docker exec -it symfony_app bash
  ```

---

## 📈 Estado Actual del Backend
✅ Refactorización de controladores completada  
✅ Lógica SQL estable (reservas, bonos, clases)  
🔄 Optimizando vistas y endpoints en `VistasRepository`  
🚧 Próximos pasos: testing E2E y documentación OpenAPI  


🔙 [Volver al README principal](../README.md)
