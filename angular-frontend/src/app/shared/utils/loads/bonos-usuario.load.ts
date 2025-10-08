// src/app/shared/utils/loads/bonos.load.ts
import { handleHttpError } from '@shared/utils/http-error';
import { UsuarioBonosContext } from '@shared/utils/context-types';

export function loadBonosPorUsuario(ctx: UsuarioBonosContext): void {
  const id = ctx.state.usuarioId;
  if (!id || id <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'bonosError');
    return;
  }

  ctx.state.cargando = true;
  ctx.state.error = null;

  ctx.vistas.getBonosPorUsuario(id).subscribe({
    next: (rows: any[]) => {
      ctx.state.bonosDeUsuario = rows ?? [];
      ctx.state.mostrarTablaBonosUsuario = true;
      ctx.state.cargando = false;
    },
    error: (e: any) => {
      handleHttpError(e, ctx.toast, undefined, 'bonosError');
      ctx.state.cargando = false;
    },
  });
}