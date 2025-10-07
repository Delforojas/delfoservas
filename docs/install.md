# 📚 Despliegue de una Aplicación Symfony y Angular con Docker Compose

Este proyecto utiliza **Docker** y **Docker Compose** para desplegar una aplicación que incluye un backend **Symfony**, un frontend **Angular** y una base de datos **PostgreSQL** de manera rápida y sencilla.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalados en tu sistema:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🚀 Instalación y Puesta en Marcha

### 1️⃣ Clonar el repositorio

```bash
git clone git@github.com:campus-CodeArts/Onboarding-SymfAngular.git
cd Onboarding-SymfAngular
```

### 2️⃣ Levantar los contenedores

```bash
docker-compose up -d
```

📌 **Nota:** la primera vez puede tardar unos minutos mientras se construyen las imágenes.

### 3️⃣ Verificar que los contenedores están corriendo

```bash
docker ps
```

Deberías ver tres contenedores en ejecución: **PostgreSQL**, **Symfony (backend)** y **Angular (frontend)**.

### 4️⃣ Acceder a la aplicación

- **Frontend:**  
  👉 [http://localhost:4200](http://localhost:4200)

- **Backend (Symfony):**  
  👉 [http://localhost:8000](http://localhost:8000)

- **Base de datos (PostgreSQL):**  
  Puerto `5432` (normalmente no es necesario acceder desde navegador)

---

## 🔄 Detener y Reiniciar los Contenedores

- **Detener contenedores en ejecución:**
  ```bash
  docker-compose down
  ```

- **Volver a iniciarlos:**
  ```bash
  docker-compose up -d
  ```

---

## 🧹 Eliminar los Contenedores y Datos Persistentes

Si quieres eliminar los contenedores junto con los volúmenes y datos almacenados:

```bash
docker-compose down -v
```

⚠️ **Advertencia:** Esto eliminará todos los datos almacenados en la base de datos PostgreSQL.

---

## 🧰 Comandos útiles

- **Acceder al contenedor del Frontend (Angular):**
  ```bash
  docker exec -it angular_frontend sh
  ```

- **Acceder al contenedor del Backend (Symfony):**
  ```bash
  docker exec -it symfony_backend bash
  ```

- **Solución de permisos:**
  ```bash
  sudo chmod 775 -R angular-frontend
  sudo chmod 775 -R symfony-backend
  ```

---

## 🧩 Desarrollo local (sin Docker) — Frontend Angular

Si prefieres levantar el **frontend** directamente en tu máquina:

1. **Instala Node.js (versión LTS recomendada):**  
   👉 [https://nodejs.org](https://nodejs.org)

2. **Instala Angular CLI (opcional):**
   ```bash
   npm install -g @angular/cli
   ```

3. **Instala dependencias y ejecuta el proyecto:**
   ```bash
   cd angular-frontend
   npm ci        # o npm install
   npm run start # o ng serve
   ```

La aplicación estará disponible en:  
👉 [http://localhost:4200](http://localhost:4200)

> ⚙️ **Asegúrate de que las URLs del backend en tu archivo** `environment.ts` **apunten a:**  
> `http://localhost:8000/api`

---

## 🗄️ Base de Datos y Migraciones (Symfony / Doctrine)

Las migraciones se ejecutan desde **Symfony (Doctrine)**, no desde DBeaver.

1. **Crear la base de datos (si no existe):**
   ```bash
   docker exec -it symfony_backend php bin/console doctrine:database:create
   ```

2. **Ejecutar migraciones:**
   ```bash
   docker exec -it symfony_backend php bin/console doctrine:migrations:migrate -n
   ```

3. **Verificar conexión en el archivo `.env` del backend:**
   ```env
   DATABASE_URL="postgresql://symfony:symfony@postgres:5432/symfony_db?serverVersion=16&charset=utf8"
   ```

---

## 🧠 Conectar desde DBeaver (solo para visualizar datos)

- **Host:** `localhost`  
- **Puerto:** `5432`  
- **Base de datos:** `symfony_db`  
- **Usuario:** `symfony`  
- **Contraseña:** `symfony`

> 💡 *DBeaver se usa únicamente para inspeccionar datos o tablas, no para ejecutar migraciones.*

---

## 🛳️ Frontend dentro de Docker

Si el contenedor de Angular no tiene las dependencias instaladas:

```bash
docker exec -it angular_frontend npm ci
docker exec -it angular_frontend npm run start
```

---

## 🧯 Troubleshooting rápido

- **Puertos ocupados:** cambia los puertos en `docker-compose.yml` o cierra procesos locales.  
- **Errores CORS:** revisa el `nelmio/cors-bundle` en Symfony para permitir `http://localhost:4200`.  
- **Problemas de permisos:**  
  ```bash
  docker exec -it symfony_backend chown -R www-data:www-data var
  ```

---

## 🎯 Notas Finales

- Para ver los registros en tiempo real:
  ```bash
  docker-compose logs -f
  ```

Para más información sobre cada tecnología:
- [Documentación de Symfony](https://symfony.com/doc)
- [Documentación de Angular](https://angular.io/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)

---

## ❤️ Autor

Desarrollado por **Delfo Rojas**  
Proyecto Full-Stack con **Symfony**, **Angular** y **PostgreSQL** desplegado mediante **Docker Compose**.
