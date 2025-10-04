export interface UsuarioPagosState {
  usuarios: any | null;
  usuarioId: number | null;
  usuariosLista?: any[];                 // si tienes un listado para elegir
  usuarioSeleccionadoId?: number | null;
  usuarioSeleccionado?: any | null;

  walletUsuario: any[];

  mostrarTablaWalletUsuario: boolean;
  mostrarTablaBonosUsuario: boolean;
  mostrarTablaReservasUsuario: boolean;

  cargando: boolean;
  error: string | null;
}

export function createInitialUsuarioPagosState(): UsuarioPagosState {
  return {
    usuarios: null,
    usuarioId: null,
    

    walletUsuario: [],

    mostrarTablaWalletUsuario: false,
    mostrarTablaBonosUsuario: false,
    mostrarTablaReservasUsuario: false,

    cargando: false,
    error: null,
  };
}