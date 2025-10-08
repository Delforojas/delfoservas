import { handleHttpError } from "../http-error";
import { ReservarClaseContext } from "../context-types"



export function loadClassMonday(ctx: any): void {
  ctx.reservasService.getClassMonday().subscribe({
    next: (data: any[]) => {
      ctx.state.clasesPorDia.L = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

export function loadClassTuesday(ctx: any): void {
  ctx.reservasService.getClassTuesday().subscribe({
    next: (data: any[]) => {
      ctx.state.clasesPorDia.M = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

export function loadClassWednesday(ctx: any): void {
  ctx.reservasService.getClassWednesday().subscribe({
    next: (data: any[]) => {
      ctx.state.clasesPorDia.X = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

export function loadClassThursday(ctx: any): void {
  ctx.reservasService.getClassThursday().subscribe({
    next: (data: any[]) => {
      ctx.state.clasesPorDia.J = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

export function loadClassFriday(ctx: any): void {
  ctx.reservasService.getClassFriday().subscribe({
    next: (data: any[]) => {
      ctx.state.clasesPorDia.V = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

export function loadAlumnosDeClase(ctx: ReservarClaseContext, id: number): void {
  ctx.state.cargandoAlumnos = true;
  ctx.state.errorAlumnos = null;
  ctx.state.alumnos = [];
  ctx.state.claseSeleccionadaId = id;

  ctx.claseService.getAlumnosDeClase(id).subscribe({
    next: (rows: any[]) => {
      ctx.state.alumnos = rows ?? [];
      ctx.state.mostrarTablaAlumnos = true;
      ctx.state.cargandoAlumnos = false;
    },
    error: (e: any) =>
      handleHttpError(e, ctx.toast, undefined, 'alumnosError'),
  });
}

export function reservarClase(ctx: ReservarClaseContext , id: number): void {
    const claseId = Number(id);
    if (!Number.isFinite(claseId) || claseId <= 0) {
        handleHttpError({ status: 400 } as any , ctx.toast, undefined, 'reservarError');
        return;
    }

    ctx.reservandoId = claseId;

    ctx.reservasService.reservarClase(claseId).subscribe({
        next: () => {
            handleHttpError({ status: 200 } as any , ctx.toast, undefined, 'reservarSuccess');

            if (ctx.mostrarTablaL) loadClassMonday(ctx);
            if (ctx.mostrarTablaM) loadClassTuesday(ctx);
            if (ctx.mostrarTablaX) loadClassWednesday(ctx);
            if (ctx.mostrarTablaJ) loadClassThursday(ctx);
            if (ctx.mostrarTablaV) loadClassFriday(ctx);

            if (ctx.mostrarTablaAlumnos && ctx.claseSeleccionadaId === claseId) {
                loadAlumnosDeClase(ctx, claseId);
            }
        },
        error: (e: any ) => handleHttpError(e, ctx.toast, undefined, 'reservarError'),
    });
}