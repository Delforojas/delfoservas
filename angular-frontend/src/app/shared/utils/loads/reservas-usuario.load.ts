import { handleHttpError } from "../http-error";
import { UsuarioReservasContext } from "../context-types";

export function loadReservasUsuario(ctx: UsuarioReservasContext): void {
  const uid = ctx.state.usuarioId;
  if (!uid || uid <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'cargarUsuarioError');
    return;
  }

  ctx.state.cargando = true;
  ctx.state.error = null;

  ctx.vistas.getReservasPorUsuario(uid).subscribe({
    next: (rows: any[]) => {
      ctx.state.reservasUsuario = rows ?? [];
      ctx.state.mostrarTablaReservasUsuario = true;
      ctx.state.cargando = false;
    },
    error: (e: any) => {
      ctx.state.cargando = false;
      handleHttpError(e, ctx.toast, undefined, 'reservasUsuarioError');
    },
  });
}

export function deleteReservaUsuario(ctx: UsuarioReservasContext, reservaId: number): void {
  if (!Number.isFinite(reservaId) || reservaId <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'eliminarReservaSuccess');
    return;
  }

  ctx.state.eliminandoId = reservaId;

  ctx.reservationService.eliminarReservation(reservaId).subscribe({
    next: () => {
      ctx.state.reservasUsuario = (ctx.state.reservasUsuario ?? []).filter(r => r.reserva_id !== reservaId);
      ctx.state.eliminandoId = null;
    },
    error: (e: any) => {
      ctx.state.eliminandoId = null;
      handleHttpError(e, ctx.toast, undefined, 'eliminarReservaError');
    },
  });
}