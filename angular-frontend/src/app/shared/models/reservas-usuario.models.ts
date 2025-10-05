import { ReservaUsuarioDto } from '../interfaces/reservaUsuarioDto.interface';

export interface UsuarioReservasState {
  usuarios: any | null;
  usuarioId: number | null;

  reservasUsuario: ReservaUsuarioDto[];

  mostrarTablaReservasUsuario: boolean;
  mostrarTablaBonosUsuario: boolean;
  mostrarTablaWalletUsuario: boolean;

  eliminandoId: number | null;

  cargando: boolean;
  error: string | null;
}

export function createInitialUsuarioReservasState(): UsuarioReservasState {
  return {
    usuarios: null,
    usuarioId: null,

    reservasUsuario: [],

    mostrarTablaReservasUsuario: false,
    mostrarTablaBonosUsuario: false,
    mostrarTablaWalletUsuario: false,

    eliminandoId: null,

    cargando: false,
    error: null,
  };
}