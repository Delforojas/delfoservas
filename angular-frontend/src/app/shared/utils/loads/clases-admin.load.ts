import { handleHttpError } from '@shared/utils/http-error';
import { ClasesProfesorContext} from '@shared/utils/context-types';
import { CrearClaseContext } from '@shared/utils/context-types';
import { finalize } from 'rxjs';



export function loadClases(ctx: CrearClaseContext): void {
  ctx.claseService.getClases().subscribe({
    next: d => (ctx.state.clases = d ?? []),
    error: e => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

export function loadClasesProfesores(ctx: ClasesProfesorContext): void {
  ctx.state.cargando = true;

  ctx.claseService.getMisClases()
    .pipe(finalize(() => (ctx.state.cargando = false)))
    .subscribe({
      next: (rows: any[]) => (ctx.state.clasesProfe = rows ?? []),
      error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'misClasesError'),
    });
}

export function loadClasesVista(ctx: any): void {
    ctx.claseService.getClasesVista().subscribe({
        next: (rows: any[]) => (ctx.clasesVista = rows ?? []),
        error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'vistaClasesError'),
    });
}
export function loadAlumnos(ctx: ClasesProfesorContext, id: number): void {
  ctx.state.cargandoAlumnos = true;
  ctx.state.errorAlumnos = null;
  ctx.state.alumnos = [];
  ctx.state.claseSeleccionadaId = id;

  ctx.claseService.getAlumnosDeClase(id)
    .pipe(finalize(() => (ctx.state.cargandoAlumnos = false)))
    .subscribe({
      next: (rows: any[]) => {
        ctx.state.alumnos = rows ?? [];
        ctx.state.mostrarTablaAlumnos = true;
      },
      error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'alumnosError'),
    });
}

export function deleteClase(ctx: any, id: number): void {
    if (!confirm('¿Eliminar esta clase?')) return;
    ctx.claseService.eliminarClase(id).subscribe({
        next: () => loadClases(ctx),
        error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'eliminarClaseError'),
    });
}

export function deleteAlumnoDeClase(ctx: any, a: any): void {
    if (!a?.alumno_reservation_id) {
        handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'eliminarReservaError');
        return;
    }
    if (!confirm(`¿Eliminar la reserva de ${a.alumno_nombre}?`)) return;

    ctx.eliminandoId = a.alumno_reservation_id;

    ctx.reservationService.eliminarReservation(a.alumno_reservation_id)
        .pipe(finalize(() => (ctx.eliminandoId = null)))
        .subscribe({
            next: () => {
                ctx.alumnos = (ctx.alumnos ?? []).filter(
                    (x: any) => x.alumno_reservation_id !== a.alumno_reservation_id
                );
                if (ctx.claseSeleccionadaId != null) loadAlumnos(ctx, ctx.claseSeleccionadaId);
                loadClasesProfesores(ctx);
            },
            error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'eliminarReservaError'),
        });
}
