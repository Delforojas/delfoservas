# 🧱 Arquitectura por Features: Models + Contexts + Loads + Components

## 📘 Visión general

Este enfoque divide la lógica de cada módulo en **cuatro capas claras**:

| Capa | Función | Contiene |
|------|----------|-----------|
| `models/` | Define la estructura del estado | Interfaces y `createInitialState()` |
| `context-types/` | Define qué necesita cada feature | Estado + servicios + toast |
| `loads/` | Ejecuta lógica de negocio | Funciones puras con efectos |
| `components/` | Orquesta la UI | Estado + servicios + invocación de loads |

---

## 🧩 Flujo general

```
[ models/* ]           → estructura de datos (state)
[ context-types/* ]    → contrato entre lógica y componente
[ loads/* ]            → lógica: peticiones, validaciones, setState
[ components/* ]       → UI + wiring + delega en loads
```

---

## 📄 Ejemplo: Bonos de usuario

### 1️⃣ Modelo

```ts
export interface UsuarioBonosState {
  usuarios: any | null;
  usuarioId: number | null;
  bonosDeUsuario: any[];
  mostrarTablaBonosUsuario: boolean;
  mostrarTablaReservasUsuario: boolean;
  mostrarTablaWalletUsuario: boolean;
  cargando: boolean;
  error: string | null;
}

export function createInitialUsuarioBonosState(): UsuarioBonosState {
  return {
    usuarios: null,
    usuarioId: null,
    bonosDeUsuario: [],
    mostrarTablaBonosUsuario: false,
    mostrarTablaReservasUsuario: false,
    mostrarTablaWalletUsuario: false,
    cargando: false,
    error: null,
  };
}
```

### 2️⃣ Contexto

```ts
export interface UsuarioBonosContext {
  state: UsuarioBonosState;
  vistas: VistasService;
  toast: ToastService;
}
```

### 3️⃣ Load

```ts
export function loadBonosPorUsuario(ctx: UsuarioBonosContext): void {
  const id = ctx.state.usuarioId;
  if (!id || id <= 0) return handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'bonosError');

  ctx.state.cargando = true;
  ctx.vistas.getBonosPorUsuario(id).subscribe({
    next: rows => {
      ctx.state.bonosDeUsuario = rows ?? [];
      ctx.state.mostrarTablaBonosUsuario = true;
      ctx.state.cargando = false;
    },
    error: e => {
      ctx.state.cargando = false;
      handleHttpError(e, ctx.toast, undefined, 'bonosError');
    }
  });
}
```

### 4️⃣ Componente

```ts
export class UsuarioBonosComponent implements OnInit, UsuarioBonosContext {
  state = createInitialUsuarioBonosState();
  constructor(public vistas: VistasService, public auth: AuthService, public toast: ToastService) {}
  
  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: u => {
        this.state.usuarios = u;
        this.state.usuarioId = Number(u?.id) || null;
        if (this.state.usuarioId) loadBonosPorUsuario(this);
      },
      error: e => handleHttpError(e, this.toast),
    });
  }
}
```

---

## ⚙️ Configuración de Alias y Barrel

### tsconfig.json
```json
"baseUrl": "./src",
"paths": {
  "@shared/*": ["app/shared/*"]
}
```

### Barrel de loads (`shared/utils/loads/index.ts`)
```ts
export { loadBonosPorUsuario } from './bonos-usuario.load';
export { loadWalletUsuario } from './gestion-pagos.load';
export { loadReservasUsuario, deleteReservaUsuario } from './reservas-usuario.load';
export {
  loadClassMonday, loadClassTuesday, loadClassWednesday,
  loadClassThursday, loadClassFriday, loadAlumnosDeClase, reservarClase
} from './reservar-clase.load';
export {
  loadClasesVista as loadClasesVistaAdmin,
  loadClasesProfesores, loadAlumnos, deleteClase, deleteAlumnoDeClase
} from './clases-admin.load';
export {
  loadClases, loadClasesVista, loadTiposClase, loadRooms,
  loadProfesores, crearClase
} from './crear-clase.load';
```

---

## 💡 Filosofía

- **Los `loads` no crean clases**, ejecutan lógica de negocio.
- **Los componentes no contienen lógica**, solo delegan.
- **El contexto (context-type)** garantiza que los `loads` reciban todo lo necesario.
- **El tipado fuerte** previene errores de dependencias o propiedades faltantes.

---

## 🧠 Ventajas

✅ Código modular y escalable  
✅ Tipado fuerte entre capas  
✅ Lógica reutilizable y testeable  
✅ Limpieza en los componentes (sin lógica de negocio)  
✅ Fácil mantenimiento y documentación clara

---

## 🗺️ Mapa conceptual

```
┌──────────────────────────┐
│  COMPONENT               │
│  UI + State + Servicios  │
│  └── llama a loads()     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  LOADS                   │
│  Lógica + peticiones     │
│  Actualizan ctx.state    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  CONTEXT-TYPES           │
│  Contrato de dependencias│
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  MODELS                  │
│  Estructura de datos     │
└──────────────────────────┘
```

---

**Autor:** Delfo Rojas  
**Proyecto:** Sannu Fisioterapia  
**Stack:** Angular · Symfony · PostgreSQL · Docker  
