# 🛠️ Actualizaciones Proyecto Symfony + Angular + Docker

---

## 🔔 Implementación de Toasts (notificaciones) en Angular

### 📌 Objetivo
Añadir un sistema de notificaciones **global**, ligero y reutilizable en Angular, para mostrar mensajes de éxito, error o información.

---

### 🛠️ Pasos de implementación

1. **Creación del servicio `ToastService`**  
   Gestiona la lista de notificaciones activas y su tiempo de vida.  

2. **Creación del componente `ToastComponent`**  
   Renderiza las notificaciones en pantalla y se comunica con el servicio.
   
3. **Inyección en el componente principal (`app.component.html`)**  
   Se añade el selector `<app-toast>` para que las notificaciones sean visibles en toda la aplicación.  

---

## 📑 Refactorización de Interfaces en Angular

### 📌 Objetivo
Unificar y limpiar interfaces duplicadas para mejorar la **consistencia tipada** en el frontend.

---

### 🔄 Unificación de Interfaces
Antes había varias versiones repetidas con atributos distintos.  
Ahora se consolidó en **una única interfaz bien definida**.

---

### 🔧 Implementación en componentes y servicios
Se adaptaron los **services** y **componentes** para importar correctamente las interfaces unificadas, evitando duplicaciones:

- `clases.service.ts` → exporta **Clase, VistaClase, ClaseProfe, Alumno**  
- `reservation.service.ts` → exporta **ClaseDto, VistaClase**  
- `vistas.service.ts` → exporta **ReservaUsuarioDto**  
- Componentes como **clases-admin, clases-profesor, crear-clase**, etc. se actualizaron para usar estas interfaces centralizadas.


🔥 El proyecto queda más **ordenado**, fácil de escalar y con **feedback visual** para los usuarios.  


## 🗂️ Refactorización de Servicios con Rutas Centralizadas

### 📌 Objetivo
Organizar las rutas de la API en archivos dedicados (`*.routes.ts`) para cada módulo, de forma que:
- Se eviten strings duplicados en los servicios.
- Cambiar una ruta del backend sea tan sencillo como modificar una sola línea.
- Se mantenga un código más limpio y escalable.

---

### 🛠️ Cambios realizados

1. **Centralización de rutas**
   - Se creó una carpeta `shared/routes/` que contiene archivos como:
     - `auth-routes.ts`
     - `bonos-routes.ts`
     - `clase-routes.ts`
     - `reservation-routes.ts`
     - `room-routes.ts`
     - `tipoclase-routes.ts`
     - `users-routes.ts`
     - `vistas-routes.ts`
     - `wallet-routes.ts`

2. **Refactorización de servicios**
   - Cada servicio (`*.service.ts`) ahora importa las rutas desde su archivo correspondiente.


##✅ Resumen
	-•	✅ Sistema de toasts implementado para feedback en tiempo real.
	-•	✅ Interfaces centralizadas y sin duplicados, mejorando la mantenibilidad del código.
	-•	✅ Refactorización de imports en servicios y componentes para usar interfaces unificadas.
	-•	✅ Servicios consumen rutas centralizadas, sin URLs hardcodeadas.




