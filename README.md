# 🛠️ Actualizaciones Proyecto Symfony  

## 👤 Entidad `User`  
- Renombrada de **`Users` → `User`**.  
- Adaptada para trabajar con un **Enum `RoleEnum`** que define los roles disponibles:  
  - `ROLE_USER`  
  - `ROLE_TEACHER`  
  - `ROLE_ADMIN`  
- Métodos de acceso actualizados:  
  - `getRoles()` devuelve el valor del `RoleEnum`.  
  - `setRole(RoleEnum $role)` para asignar el rol.  

---

## 📂 Repositorio y Controlador  
- `UsersRepository` → **`UserRepository`**  
- `UsersController` → **`UserController`**  
- Se ajustaron todas las referencias en entidades (`Clase`, `Reservation`, `Wallet`, etc.) para apuntar a `App\Entity\User`.  

---

## 🔑 Roles con Enum  
- Nueva clase **`RoleEnum`** que centraliza y tipa los roles.  
- La entidad `User` usa ahora esta enumeración para garantizar integridad y evitar errores tipográficos.  

---

## ⚙️ Command para crear Admin por defecto  
Se creó el comando **`app:create-admin`**:  
- Verifica si ya existe un usuario con email/nombre definidos.  
- Si no existe, crea un usuario `ROLE_ADMIN` con credenciales por defecto:  
  - **Email:** `admin@test.com`  
  - **Password:** `Admin123,`  
- El password se guarda encriptado con `UserPasswordHasherInterface`.  

---

## 🚀 Próximos pasos  
- Probar **registro y login** con la nueva entidad `User`.  
- Confirmar que los menús dinámicos en Angular se renderizan según rol (`auth.isAdmin()`, `auth.isTeacher()`, etc.).  
- Revisar en **DBeaver** que la tabla `user` contiene la columna `role` como enum.  
