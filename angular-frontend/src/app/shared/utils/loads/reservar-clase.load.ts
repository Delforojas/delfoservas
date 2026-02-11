import { handleHttpError } from "../http-error";
import { ReservarClaseContext } from "../context-types"
import { finalize, take } from 'rxjs/operators';
import { showToast } from "../test-messages";



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

export function reservarClase(ctx: ReservarClaseContext, id: number): void {
  const claseId = Number(id);
  if (!Number.isFinite(claseId) || claseId <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'reservarError');
    return;
  }

  // 1) Optimista: pinta rojo ya
  const dia = ctx.state.tablaAbierta;
  let idx = -1;
  let prevReservationId: number | null = null;

  if (dia) {
    const arr = ctx.state.clasesPorDia[dia];
    idx = arr.findIndex(c => c.id === claseId);
    if (idx > -1) {
      prevReservationId = (arr[idx] as any).reservation_id ?? null;
      arr[idx] = { ...arr[idx], reservation_id: -1 }; // -1 = reservada temporal
    }
  }

  ctx.reservandoId = claseId;

  ctx.reservasService.reservarClase(claseId).pipe(
    take(1),
    finalize(() => { ctx.reservandoId = null; })
  ).subscribe({
    next: (resp: any) => {
      // 2) Confirmar con el id real del backend (si lo devuelve)
      const rid = Number(resp?.reservation_id ?? -1);
      if (dia && idx > -1) {
        const arr = ctx.state.clasesPorDia[dia];
        arr[idx] = { ...arr[idx], reservation_id: rid > 0 ? rid : -1 };
      }

      // (Opcional) refrescar listados visibles
      if (ctx.mostrarTablaL) loadClassMonday(ctx);
      if (ctx.mostrarTablaM) loadClassTuesday(ctx);
      if (ctx.mostrarTablaX) loadClassWednesday(ctx);
      if (ctx.mostrarTablaJ) loadClassThursday(ctx);
      if (ctx.mostrarTablaV) loadClassFriday(ctx);
      if (ctx.mostrarTablaAlumnos && ctx.claseSeleccionadaId === claseId) {
        loadAlumnosDeClase(ctx, claseId);
      }

      showToast(ctx.toast ,'ReservaSuccess');
    },
    error: (e: any) => {
      // 3) Revertir si falla
      if (dia && idx > -1) {
        const arr = ctx.state.clasesPorDia[dia];
        arr[idx] = { ...arr[idx], reservation_id: prevReservationId };
      }
      handleHttpError(e, ctx.toast, undefined, 'reservarError');
    },
  });
}

export function deleteReserva(ctx: ReservarClaseContext, reservaId: number, claseId: number): void {
  const rid = Number(reservaId);
  const cid = Number(claseId);
  if (!Number.isFinite(rid) || rid <= 0 || !Number.isFinite(cid) || cid <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'reservarError');
    return;
  }

  ctx.cancelandoId = rid;

  ctx.reservasService.eliminarReservation(rid).subscribe({
    next: () => {
      // ✅ pintar en verde: quitar la reserva de la clase actual
      const dia = ctx.state.tablaAbierta;
      if (dia) {
        const arr = ctx.state.clasesPorDia[dia];
        const i = arr.findIndex(c => c.id === cid);
        if (i > -1) {
          arr[i] = { ...arr[i], reservation_id: null, completa: false }; // opcional completa=false
        }
      }
       showToast(ctx.toast, 'ReservaCanceladaSuccess');
      ctx.cancelandoId = null;
    },
    error: (e) => {
      ctx.cancelandoId = null;
      handleHttpError(e, ctx.toast, undefined, 'reservarError');
    },
  });
}

