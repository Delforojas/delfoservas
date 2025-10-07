# 🛠️ Actualizaciones Proyecto Symfony + Angular + Docker

## 🔑 Centralización de Headers de Autenticación

### 🎯 Objetivo
Se eliminó la repetición del `Authorization: Bearer <token>` en cada servicio Angular.  
Ahora existe una clase única encargada de generar los headers con el token.

### ✅ Beneficios
- Centralización → la lógica de autenticación vive en un solo archivo.  
- Reutilización → todos los servicios consumen la misma clase.  
- Mantenimiento → si cambia la forma de obtener el token, solo se toca un punto del código.  

---

## 🌍 Refactorización de Rutas con Environment

### 🎯 Objetivo
Centralizar la **base URL** de la API en el archivo `environment.ts` para simplificar la gestión de entornos (local, producción, staging).

### ✅ Beneficios
- Cambio centralizado → un ajuste en `environment` actualiza toda la aplicación.  
- Orden → cada recurso (clases, reservas, usuarios, bonos) tiene su propio archivo de rutas.  
- Escalabilidad → se facilita añadir o modificar endpoints.  

---

## 📌 Rutas de la API (Angular)

Cada recurso de la API ahora tiene su propio archivo de rutas en Angular.  
Por ejemplo: `clases-routes.ts`, `reservation-routes.ts`, `users-routes.ts`, etc.  
Esto permite que el código sea más ordenado y que los servicios consuman las rutas de forma consistente.  

---

## 📡 Servicios Angular

Los servicios en Angular fueron refactorizados para:  
- Usar las rutas centralizadas.  
- Aplicar los headers de autenticación de forma unificada.  
- Mantener un código más limpio en los componentes.  

De esta forma, los servicios se encargan de toda la comunicación con la API y los componentes solo se ocupan de la lógica de presentación.  

---

## 🎮 Controladores Symfony (Backend)

En el backend se organizaron los **controladores** para exponer endpoints claros y consistentes.  
Ejemplos de controladores:  
- `ClaseController` → gestiona las clases (crear, listar, actualizar, eliminar).  
- `ReservationController` → gestiona reservas, validaciones de aforo, bonos y vistas por día.  
- `UsersController` → gestiona usuarios y profesores.  

Además, se añadieron restricciones de seguridad con roles (`ROLE_ADMIN`, `ROLE_TEACHER`) usando las herramientas de Symfony.  

---

## 🚀 Resumen

Con esta rama se consiguió:  
- 🔑 Headers de autenticación centralizados.  
- 🌍 Base URL desacoplada y configurable por entorno.  
- 📌 Rutas organizadas por recurso.  
- 📡 Servicios Angular claros y reutilizables.  
- 🎮 Controladores Symfony robustos y seguros.  
