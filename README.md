# 🚀 Proyecto Symfony + Angular + Docker

## 📌 Rutas Angular
- Se dejaron solo las rutas activas:
  - **Públicas**: `/login`, `/register`
  - **Protegidas dentro de `/menu5`**:
    - Usuario: `reservasclase`, `bonos`, `reservas`, `pagosusuario`
    - Solo `ROLE_ADMIN` y `ROLE_TEACHER`: `crear`, `admin`, `profe`, `pagos`
- Rutas antiguas (`menu`, `menu2`, `menu3`, `menu4`) marcadas como prescindibles.

---

## 🗂️ Organización de carpetas
- **/pages/** → vistas completas que se usan como rutas (Login, Register, Reservas, Clases, etc.)
- **/shared/components/** → componentes reutilizables (AsideUsuario, AsideProfesor, Header, Footer)
- **/shared/services/** → servicios centralizados (AuthService, ReservationService, ClasesService)
- **/shared/guards/** → guards de autenticación y roles
- Limpieza de `modules/menu/` eliminando ficheros obsoletos (`menu.component.ts`, `menu2`, `menu3`, `menu4`, etc.)

---

## 📜 Ajustes en rutas (`app.routes.ts`)
- Consolidación de rutas en **`menu5`** con `AppShellComponent` como layout principal.
- **Rutas usuario**: `/bonos`, `/reservas`, `/pagosusuario`, `/reservasclase`
- **Rutas protegidas (`ROLE_ADMIN` / `ROLE_TEACHER`)**: `/crear`, `/admin`, `/profe`, `/pagos`

---

## 🧩 Componentes actualizados
- **AsideProfesorComponent**
  - Movido a `shared/components/`
  - Con su propio `.html` limpio
  - Incluye menú dinámico que muestra opciones según roles (`auth.isAdmin()`, `auth.isTeacher()`)
- **AppShellComponent**
  - Importa header, aside y footer como standalone components
  - Define el layout principal con `<router-outlet>`

---

## 🚧 Pendiente
- Crear usuarios con roles correctos (`ROLE_ADMIN`, `ROLE_USER`, etc.) para verificar visibilidad de menús y rutas protegidas.
- Depurar imports relativos y migrarlos a paths con `tsconfig.json` (`@components/*`, `@pages/*`, etc.)
- Revisar qué ficheros de `modules/menu/` son realmente borradores y eliminarlos del repo

---

## ✅ Conclusión
En esta sesión se reorganizó el **frontend Angular** para hacerlo más modular y mantenible:
- Se limpiaron rutas y archivos obsoletos.
- Se separaron páginas y componentes reutilizables.
- Se reforzó la lógica de menús según roles.

Esto deja el proyecto listo para seguir avanzando con usuarios reales y roles en el backend.
