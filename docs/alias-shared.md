# 🧭 Configuración de alias `@shared/*` en Angular

Esta configuración permite **importar módulos, servicios, modelos o contextos** del directorio  
`src/app/shared/` usando rutas limpias y cortas como:

```ts
import { ToastService } from '@shared/services/toast.service';
import { ClasesState } from '@shared/models/clases.models';
```

en lugar de rutas relativas largas como:

```ts
import { ToastService } from '../../../shared/services/toast.service';
```

---

## ⚙️ 1. Configuración del alias en TypeScript

Edita el archivo **`tsconfig.json`** en la raíz del proyecto y añade el siguiente bloque dentro de `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/app/shared/*"]
    }
  }
}
```

> 🧩 Este alias indica a TypeScript que todo lo que empiece por `@shared/` se buscará dentro de `src/app/shared/`.

---

## 🧱 2. Verifica la herencia de configuración

Abre **`tsconfig.app.json`** (el de la app Angular) y asegúrate de que extiende del principal `tsconfig.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
```

> 📌 Si tu proyecto usa **`tsconfig.base.json`**, define allí el bloque de `paths` y confirma que los demás `tsconfig` lo extienden correctamente.

---

## 🔁 3. Reinicia el entorno para aplicar los cambios

- **En VS Code:**  
  Abre la paleta de comandos (`Ctrl + Shift + P` o `Cmd + Shift + P`) y ejecuta:  
  **➡️ “TypeScript: Restart TS Server”**

- **En Angular CLI:**  
  Detén y reinicia el servidor de desarrollo:

```bash
npm run start
# o
ng serve
```

---

## 📂 4. Estructura del alias `@shared/*`

El alias apunta a la siguiente estructura dentro de `src/app/`:

```
src/
 └── app/
     └── shared/
         ┣ services/
         ┣ models/
         ┣ interfaces/
         ┣ contexts/
         ┗ utils/
```

Por ejemplo:

```
src/app/shared/services/reservation.service.ts
src/app/shared/models/clases.models.ts
```

---

## 💡 5. Ejemplo de uso real

```ts
import { ReservationService } from '@shared/services/reservation.service';
import { ToastService } from '@shared/services/toast.service';
import { ClasesState } from '@shared/models/clases.models';
import { CrearClaseContext } from '@shared/contexts/clases.context';
```

---

✨ **Resultado:**  
Gracias a esta configuración, tu código queda más **limpio, profesional y mantenible**, especialmente en proyectos grandes o modulares.
