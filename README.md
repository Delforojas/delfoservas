##### 🛠️ Actualizaciones Proyecto Symfony + Angular + Docker

## 📌 Rutas Angular
- Se dejaron solo las rutas activas:
  - **Públicas**: `/login`, `/register`
  - **Protegidas dentro de `/dashboard`**:
    - Usuario: `reservasclase`, `bonos`, `reservas`, `pagosusuario`
    - Solo `ROLE_ADMIN` y `ROLE_TEACHER`: `crear`, `admin`, `profe`, `pagos`
- Rutas antiguas (`menu`, `menu2`, `menu3`, `menu4`) eliminadas o marcadas como prescindibles.

---

## 🗂️ Organización de carpetas
- **/pages/** → vistas completas que se usan como rutas (Login, Register, Reservas, Clases, etc.)
- **/shared/components/** → componentes reutilizables (AsideUsuario, AsideProfesor, Header, Footer)
- **/shared/services/** → servicios centralizados (AuthService, ReservationService, ClasesService)
- **/shared/guards/** → guards de autenticación y roles
- Limpieza de `modules/menu/` eliminando ficheros obsoletos (`menu.component.ts`, `menu2`, `menu3`, `menu4`, etc.)

---

## 📜 Ajustes en rutas (`app.routes.ts`)
- Consolidación de rutas en **`/dashboard`** con `AppComponent` como layout principal.
- **Rutas usuario**: `/bonos`, `/reservas`, `/pagosusuario`, `/reservasclase`
- **Rutas protegidas (`ROLE_ADMIN` / `ROLE_TEACHER`)**: `/crear`, `/admin`, `/profe`, `/pagos`

---

## 🧩 Componentes actualizados
- **AsideProfesorComponent**
  - Movido a `shared/components/`
  - Con su propio `.html` limpio
  - Incluye menú dinámico que muestra opciones según roles (`auth.isAdmin()`, `auth.isTeacher()`)
- **AppComponent**
  - Importa header, aside y footer como standalone components
  - Define el layout principal con `<router-outlet>`

---

## ⚙️ Backend Symfony
- Actualización de la entidad **User** (antes `Users`):
  - Simplificación de la entidad a `User.php`
  - Asociación con **Enum `RoleEnum`** para los roles (`ROLE_USER`, `ROLE_TEACHER`, `ROLE_ADMIN`).
- Creación de un **Command `app:create-admin`** para inicializar un admin por defecto al lanzar la app.
- Ajuste de repositorios y controladores (`UserRepository`, `UserController`).

---

## 🚧 Pendiente
- Crear usuarios con roles correctos (`ROLE_ADMIN`, `ROLE_USER`, etc.) para verificar visibilidad de menús y rutas protegidas.
- Depurar imports relativos y migrarlos a paths con `tsconfig.json` (`@components/*`, `@pages/*`, etc.)
- Revisar qué ficheros de `modules/menu/` son realmente borradores y eliminarlos del repo.

---

## ✅ Conclusión
En esta sesión se reorganizó el **frontend Angular** para hacerlo más modular y mantenible, además de alinear el backend Symfony:
- Se limpiaron rutas y archivos obsoletos.
- Se separaron páginas y componentes reutilizables.
- Se reforzó la lógica de menús según roles.
- Se corrigió la entidad `User` y se añadió un `Command` para la creación automática de un usuario admin.



