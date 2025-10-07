|Funcionalidades|
|:-------- |
| 👤 Gestión de usuarios y roles (admin, profesor, alumno).| 
| 🧑‍🏫 Gestión de clases deportivas: creación, asignación de profesor, horarios, salas y aforo.|
|📅 Sistema de reservas inteligente con control de plazas y validación de duplicados.|
|🎟️ Gestión automática de bonos (wallets): cada reserva descuenta créditos del bono del usuario.|
|🧾 Reportes en SQL: vistas optimizadas (vista_clases, vista_wallet_usuario, vista_profesores).|
|🔐 Seguridad JWT + control de roles para acceso a endpoints según el tipo de usuario.|
|🧠 Arquitectura modular en frontend para facilitar mantenibilidad y escalabilidad del código.|

# ⚙️ Funcionalidades Principales – Delfoservas

El sistema **Delfoservas** centraliza toda la gestión de un centro deportivo o fisioterapia, ofreciendo un flujo completo desde la creación de clases hasta la reserva de usuarios.

---

## 👤 Usuarios y Roles

- Registro y autenticación de usuarios mediante **JWT**.
- Roles definidos:  
  - **Admin:** gestión completa del sistema.  
  - **Profesor:** administración de sus clases y alumnos.  
  - **Usuario:** acceso a reservas, bonos y wallet.

---

## 🧑‍🏫 Gestión de Clases

- Creación, edición y eliminación de clases.
- Asignación de **profesor**, **sala** y **tipo de clase**.
- Control de **aforo y plazas disponibles**.
- Vistas SQL que muestran:
  - Clases por profesor
  - Clases con alumnos inscritos
  - Estado de cada clase (completa / disponible)

---

## 📅 Sistema de Reservas

- Reservas con validación de duplicados.
- Verificación de plazas disponibles antes de confirmar.
- Lógica SQL y triggers que actualizan automáticamente:
  - Bonos consumidos.
  - Plazas restantes.
  - Estado de clase completa.

---

## 🎟️ Bonos y Wallets

- Creación automática de bonos al generar una compra o pago.
- Cada reserva **descuenta** una clase del bono correspondiente.
- Devolución automática si se cancela la reserva antes del inicio.
- Vistas optimizadas:
  - `vista_wallet_usuario`
  - `vista_bonos_por_usuario`

---

## 🧾 Reportes SQL

- **Vistas y procedimientos** para obtener reportes de:
  - Reservas activas por usuario
  - Clases por profesor
  - Bonos activos y expirados
  - Estado de aforo por sala o tipo de clase

---

## 🧠 Arquitectura Frontend (Angular)

- Módulos independientes y **state/context/load pattern**.
- Componentes standalone + servicios reutilizables.
- Gestión centralizada de errores con `handleHttpError()`.
- Integración de toasts, loaders y control de sesiones.

---

## 🧱 Arquitectura Backend (Symfony)

- Controladores desacoplados con rutas organizadas.
- Repositorios personalizados (`fetchAllAssociative`) para queries SQL avanzadas.
- Validaciones con HTTP status coherentes.
- Integración con LexikJWT para roles y permisos.

---



🔙 [Volver al README principal](../README.md)