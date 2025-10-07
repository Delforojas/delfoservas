# 🧱 Arquitectura Frontend (Angular)

> Base común para todos los módulos de UI del proyecto **Delfoservas**.  
> Patrón: **state → context → load → component** con servicios desacoplados y utilidades reutilizables.

---

## 📋 Tabla de contenidos
- [🧱 Arquitectura Frontend (Angular)](#-arquitectura-frontend-angular)
  - [📋 Tabla de contenidos](#-tabla-de-contenidos)
  - [🧠 Principios](#-principios)
  - [🗂️ Estructura de carpetas](#️-estructura-de-carpetas)
  - [🔁 Flujo de datos (state/context/load)](#-flujo-de-datos-statecontextload)
  - [⚙️ Capas y responsabilidades](#️-capas-y-responsabilidades)
    - [1️⃣ `models/*.models.ts`](#1️⃣-modelsmodelsts)
    - [2️⃣ `utils/interfaces.ts`](#2️⃣-utilsinterfacests)
    - [3️⃣ `utils/load.ts`](#3️⃣-utilsloadts)
    - [4️⃣ `services/*.service.ts`](#4️⃣-servicesservicets)
    - [5️⃣ Componentes (`modules/*`)](#5️⃣-componentes-modules)
  - [🧩 Convenciones](#-convenciones)
  - [🧱 Cómo crear una nueva funcionalidad](#-cómo-crear-una-nueva-funcionalidad)
    - [🧩 Modelo de estado](#-modelo-de-estado)
    - [⚙️ Contexto](#️-contexto)
    - [🔁 Acciones](#-acciones)
    - [🧠 Componente](#-componente)
  - [🔐 Autenticación y headers](#-autenticación-y-headers)
  - [🛣️ Rutas](#️-rutas)
  - [❗ Gestión de errores y toasts](#-gestión-de-errores-y-toasts)
  - [⚡ Rendimiento y DX](#-rendimiento-y-dx)
  - [📚 Apéndice: enlaces a docs específicas](#-apéndice-enlaces-a-docs-específicas)

---

## 🧠 Principios

- **Baja fricción:** componentes ligeros, lógica en `load.ts`.
- **Tipado fuerte:** `models` definen el estado; `interfaces` definen contextos.
- **Reutilizable:** servicios HTTP finos y toasts centralizados.
- **Escalable:** cada feature se estructura igual, reduciendo complejidad cognitiva.

---

## 🗂️ Estructura de carpetas

```bash
angular-frontend/src/app/
├─ modules/
│  └─ menu/
│     ├─ reservar-clase.component.ts / .html
│     ├─ clases-admin.component.ts / .html
│     ├─ clases-profesor.component.ts / .html
│     ├─ bonos-usuario.component.ts / .html
│     └─ pagos-usuario.component.ts / .html
├─ shared/
│  ├─ components/
│  │  ├─ header.component.ts
│  │  └─ aside-*.component.ts
│  ├─ interfaces/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  └─ utils/
│     ├─ load.ts
│     ├─ interfaces.ts
│     ├─ auth-headers.ts
│     ├─ http-error.ts
│     └─ test-messages.ts
└─ app.routes.ts
```

---

## 🔁 Flujo de datos (state/context/load)

```
[Componente] ──► [función load] ──► [servicio HTTP] ──► [API]
      ▲                                         │
      │                                         ▼
      └── renderiza con [state en models] ◄── actualización load
```

- **State:** define datos y flags de carga.
- **Context:** conecta servicios y estado.
- **Load:** ejecuta lógica (fetch, validaciones, errores).
- **Component:** solo renderiza y maneja eventos.

---

## ⚙️ Capas y responsabilidades

### 1️⃣ `models/*.models.ts`
- Define el estado base de cada módulo.
- Sin lógica ni dependencias.

### 2️⃣ `utils/interfaces.ts`
- Contextos: `ReservarClaseContext`, `ClasesProfesorContext`…
- Define los servicios y elementos necesarios por acción.

### 3️⃣ `utils/load.ts`
- Contiene todas las funciones de negocio.
- Controla errores, toasts y cambios de estado.

### 4️⃣ `services/*.service.ts`
- Mínimos, solo llamadas HTTP.
- Sin estado, sin UI.

### 5️⃣ Componentes (`modules/*`)
- Gestionan la UI y llaman funciones `load()`.

---

## 🧩 Convenciones

| Tipo | Convención |
|------|-------------|
| **Estado** | `FeatureState`, `createInitialFeatureState()` |
| **Contexto** | `FeatureContext` (state, toast, services) |
| **Acción (load)** | `loadX`, `createX`, `deleteX`, `toggleX`, etc. |
| **Mensajes** | Centralizados en `test-messages.ts` |
| **Commits** | `feat:`, `fix:`, `refactor:`, `docs:` |

---

## 🧱 Cómo crear una nueva funcionalidad

### 🧩 Modelo de estado
```ts
export interface MiFeatureState { ... }
export function createInitialMiFeatureState(): MiFeatureState { ... }
```

### ⚙️ Contexto
```ts
export interface MiFeatureContext {
  state: MiFeatureState;
  toast: ToastService;
  miService: MiService;
}
```

### 🔁 Acciones
```ts
export function loadMiCosa(ctx: MiFeatureContext) {
  ctx.state.cargando = true;
  ctx.miService.getAll().subscribe({
    next: rows => {
      ctx.state.items = rows ?? [];
      ctx.state.cargando = false;
    },
    error: e => {
      ctx.state.cargando = false;
      handleHttpError(e, ctx.toast, undefined, 'miError');
    }
  });
}
```

### 🧠 Componente
```ts
state = createInitialMiFeatureState();
constructor(public miService: MiService, public toast: ToastService) {}
ngOnInit() { loadMiCosa(this); }
```

---

## 🔐 Autenticación y headers

Los headers se gestionan mediante `auth-headers.ts`:

```ts
Authorization: Bearer <token>
```

- Token almacenado en `localStorage`.
- Si no hay token → redirigir a `/login`.

---

## 🛣️ Rutas

- API: `shared/routes/*`.
- Angular: `app.routes.ts`.
- Documentación detallada 👉 [docs/rutas.md](./rutas.md)

---

## ❗ Gestión de errores y toasts

- Centralizado en `http-error.ts` y `test-messages.ts`.
- Uso:
  ```ts
  handleHttpError(error, toast, undefined, 'bonosError');
  ```
- Documentación:
  - 👉 [docs/gestion-errores.md](./gestion-errores.md)
  - 👉 [docs/toasts-interfaces.md](./toasts-interfaces.md)

---

## ⚡ Rendimiento y DX

- `trackBy` en *ngFor.
- `ChangeDetectionStrategy.OnPush`.
- Suscripciones seguras (`finalize`, `takeUntil`).
- Helpers comunes en `load.ts`.

---

## 📚 Apéndice: enlaces a docs específicas

| Documento | Descripción |
|------------|-------------|
| [refactorizacion.md](./refactorizacion.md) | Patrón `state/context/load` y evolución del código |
| [flujo-models.md](./flujo-models.md) | Cómo los modelos controlan el estado global |
| [gestion-errores.md](./gestion-errores.md) | Estrategia de manejo de errores globales |
| [toasts-interfaces.md](./toasts-interfaces.md) | Sistema de mensajes y notificaciones |
| [rutas.md](./rutas.md) | Organización de rutas API y Angular |
| [loadts.md](./loadts.md) | Catálogo de funciones de carga |
| [header.md](./header.md) | Estructura y helpers del header |

---

> 🧩 *Documento base de arquitectura Frontend – Delfoservas 2025*  
> Autor: **Delfín Rojas Espina**
🔙 [Volver al README principal](../README.md)