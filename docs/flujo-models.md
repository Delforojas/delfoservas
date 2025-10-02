# Refactorización: separación de state, interfaces y lógica

## Objetivo
Organizar el código en Angular para que los componentes sean más simples y reutilizables, separando **estado global**, **interfaces de contexto** y **funciones externas**.

---

## Flujo aplicado

1. **State en models**
   - Creamos un archivo `*.models.ts` que contiene:
     - Interfaces con el **estado completo** del componente.
     - Funciones `createInitialState()` para inicializar ese estado con valores por defecto.

2. **Interfaces de contexto**
   - Creamos un archivo `interfaces.ts` donde definimos las **dependencias mínimas** que necesitan las funciones externas (ej: servicios, toast, ids, flags de UI).
   - Sirve para tipar correctamente las funciones de `load.ts`.

3. **Funciones externas (load.ts)**
   - Movemos la lógica repetitiva o de llamadas a API a `load.ts`.
   - Estas funciones reciben como parámetro el `context` (implementa `ReservarClaseContext`) y actualizan el `state`.

4. **Componente**
   - Solo se encarga de:
     - Inicializar el `state` con `createInitialState()`.
     - Inyectar servicios.
     - Pasar `this` a las funciones de `load.ts`.
     - Renderizar la vista (`.html`) de forma declarativa.

---

## Beneficios
- **Código más limpio** → los componentes tienen solo lógica de presentación.  
- **Reutilización** → los helpers (`load.ts`) se pueden usar en otros componentes.  
- **Escalabilidad** → el patrón se extrapola fácilmente a otras funcionalidades (usuarios, bonos, pagos, etc.).  
- **Mantenimiento fácil** → si cambia un servicio o API, se ajusta solo en `load.ts` o en los modelos.

---

## Ejemplo general
- `reservas.models.ts` → define el **estado** (`ClasesReservaState`) y función `createInitialClasesReservaState()`.  
- `interfaces.ts` → define **contexto mínimo** (`ReservarClaseContext`).  
- `load.ts` → funciones como `loadClassMonday`, `reservarClase`, `loadAlumnosDeClase`.  
- `reservar-clases.component.ts` → usa `state` y delega la lógica en las funciones externas.

---