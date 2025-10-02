# 🛠️ Actualizaciones Proyecto Symfony + Angular + Docker

---

## 📦 Refactorización con `load.ts`

### 🎯 Objetivo
Centralizar funciones repetitivas de carga de datos en un archivo común (`shared/loaders/load.ts`) para:

- 🚫 Evitar duplicación de código en los componentes.  
- ✨ Mantener los componentes más limpios y enfocados en la vista.  
- 🔁 Facilitar la reutilización de lógica en diferentes módulos.  
- 🔧 Simplificar la mantenibilidad del proyecto.  

---

### 🛠️ Estructura
Las funciones de carga se encuentran en:

src/app/shared/loaders/load.ts


---

### 📌 Ejemplo de función en `load.ts`

// shared/loaders/load.ts
import { handleHttpError } from './http-error';

export function cargarClases(ctx: any) {
  ctx.clasesService.getClases().subscribe({
    next: (d: any) => (ctx.clases = d ?? []),
    error: (e: any) => handleHttpError(e, ctx.toast),
  });
}
--- 

### 📌 Ejemplo de uso en un componente

import { Component, OnInit } from '@angular/core';
import { cargarClases, cargarAlumnos, cargarBonosPorUsuario } from '@/shared/loaders/load';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  clases: any[] = [];
  alumnos: any[] = [];
  bonosDeUsuario: any[] = [];
  usuarioId = 12;

  ngOnInit(): void {
    cargarClases(this);
    cargarAlumnos(this);
    cargarBonosPorUsuario(this, this.usuarioId);
  }
}


### ✅ Beneficios
- 🧹 Código más limpio en los componentes.
- ♻️ Funciones reutilizables en varios puntos del proyecto.
- 🔄 Mantenimiento más sencillo: si cambia la lógica de carga, solo se edita en un sitio.


### 🚀 Próximos pasos
- Migrar más funciones repetidas
- Centralizar también lógica de carga de reservas, pagos, etc. en load.ts.
- Refactorizar servicios
- Separar la lógica de negocio en services y dejar load.ts solo como orquestador.
- Actualizar rutas a RESTful
- Reemplazar rutas con /create, /update, /delete por las estándar:

- Mejorar tipado
- Sustituir any por interfaces (Clase, Alumno, Bono) para aumentar la robustez del código.
- Documentación
- Crear una colección de Postman con los endpoints actualizados.

