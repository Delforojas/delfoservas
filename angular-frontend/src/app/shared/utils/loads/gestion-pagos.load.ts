import { handleHttpError } from "../http-error";
import { UsuarioPagosContext } from "../context-types";



export function loadWalletUsuario(ctx: UsuarioPagosContext): void {
  const id = Number(ctx.state.usuarioId);

  if (!id || id <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'walletError');
    return;
  }

  ctx.state.cargando = true;
  ctx.state.error = null;

  ctx.vistas.getVistaUsuarioWalletByUser(id).subscribe({
    next: (rows: any[]) => {
      ctx.state.walletUsuario = rows ?? [];
      ctx.state.mostrarTablaWalletUsuario = true;
      ctx.state.cargando = false;
    },
    error: (e: any) => {
      ctx.state.mostrarTablaWalletUsuario = false;
      ctx.state.walletUsuario = [];
      ctx.state.cargando = false;
      handleHttpError(e, ctx.toast, undefined, 'walletError');
    },
  });
}