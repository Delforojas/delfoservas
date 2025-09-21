# Proyecto Symfony + Angular + Docker

## 🚀 Puesta en marcha con Docker Compose

Levantar todos los servicios:

Servicios incluidos:
- **Postgres** (db)
- **Symfony Backend** (php + symfony-cli)
- **Angular Frontend** (ng serve)


## 🗄️ Base de datos y migraciones

Ejecutar migraciones dentro del contenedor del backend:

```bash
docker exec -it symfony_backend bash
php bin/console doctrine:migrations:migrate
```

Si hay conflictos con migraciones antiguas:

```bash
php bin/console doctrine:migrations:version --delete --all
```

---

## 👤 Creación de usuarios manualmente

Hashear una contraseña:

```bash
php bin/console security:hash-password
```

Resultado ejemplo:

```
$2y$13$VtLWDTn6PQzyxp0RL42FJuW2HQI4onsN0GOo6yivHZtzZ33VLHKWm
```

Insertar un usuario en la tabla `users`:

```sql
INSERT INTO users (nombre, email, password, roles)
VALUES ('Admin', 'admin@demo.com', '$2y$13$VtLWDTn6PQzyxp0RL42FJuW2HQI4onsN0GOo6yivHZtzZ33VLHKWm', '["ROLE_ADMIN"]');
```

---

## 🔑 Autenticación JWT

- Endpoint de login: `POST /api/login`
- Cuerpo de ejemplo:

```json
{
  "email": "admin@demo.com",
  "password": "secreto123"
}
```

- Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

Usar el token en peticiones protegidas:

```
Authorization: Bearer TU_TOKEN
```

---

## 📝 Endpoints principales

Listar rutas:

```bash
php bin/console debug:router
```

Ejemplo:

```
api_login_check     POST /api/login
api_register        POST /api/users/register
users_me            GET  /api/users/me
wallet_index        GET  /api/wallet
```

---

## 🆕 Registro de usuarios

Se añadió un endpoint público:

```php
#[Route('/api/users/register', name: 'api_register', methods: ['POST'])]
public function register(
    Request $request,
    EntityManagerInterface $em,
    UsersRepository $repo,
    UserPasswordHasherInterface $hasher
): JsonResponse {
    $data = json_decode($request->getContent(), true) ?? [];
    $email   = trim($data['email'] ?? '');
    $nombre  = trim($data['nombre'] ?? '');
    $plain   = (string) ($data['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return $this->json(['error' => 'Email inválido'], Response::HTTP_BAD_REQUEST);
    }
    if (strlen($plain) < 8) {
        return $this->json(['error' => 'Contraseña mínima 8 caracteres'], Response::HTTP_BAD_REQUEST);
    }
    if ($repo->findOneBy(['email' => $email])) {
        return $this->json(['error' => 'El email ya existe'], Response::HTTP_CONFLICT);
    }

    $u = new Users();
    $u->setNombre($nombre);
    $u->setEmail($email);
    $u->setRoles(['ROLE_USER']);
    $u->setPassword($hasher->hashPassword($u, $plain));

    $em->persist($u);
    $em->flush();

    return $this->json(['message' => 'Registrado', 'id' => $u->getId()], Response::HTTP_CREATED);
}
```

---

## 🔒 Configuración de seguridad (`security.yaml`)

```yaml
access_control:
  - { path: ^/api/login$, roles: PUBLIC_ACCESS }
  - { path: ^/api/users/register$, roles: PUBLIC_ACCESS } # 👈 ahora sí coincide
  - { path: ^/api/users/create$, roles: PUBLIC_ACCESS }
  - { path: ^/api, roles: PUBLIC_ACCESS, methods: [OPTIONS] } # preflight CORS
  - { path: ^/api, roles: IS_AUTHENTICATED_FULLY }
```

---

## 🌍 CORS (`nelmio_cors.yaml`)

```yaml
nelmio_cors:
  defaults:
    allow_origin: ['http://localhost:4200']
    allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    allow_headers: ['Content-Type', 'Authorization']
    max_age: 3600
  paths:
    '^/api/':
      allow_origin: ['http://localhost:4200']
      allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      allow_headers: ['Content-Type', 'Authorization']
      max_age: 3600
```

---

## ⚡ Flujo de uso

1. Levantar contenedores con `docker compose up`.
2. Ejecutar migraciones si es necesario.
3. Registrar un nuevo usuario vía `POST /api/users/register`.
4. Hacer login en `POST /api/login` para obtener el JWT.
5. Usar el token en peticiones protegidas (`Authorization: Bearer ...`).
6. Angular se comunica con el backend en `http://localhost:8000/api`.
