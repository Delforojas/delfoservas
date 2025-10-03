// src/app/shared/models/bonos.models.ts
export interface UsuarioBonosState {
  usuarios: any | null;
  usuarioId: number | null;

  bonosDeUsuario: any[];

  mostrarTablaBonosUsuario: boolean;
  mostrarTablaReservasUsuario: boolean;
  mostrarTablaWalletUsuario: boolean;

  cargando: boolean;
  error: string | null;
}

// Estado inicial para no repetir código
export function createInitialUsuarioBonosState(): UsuarioBonosState {
  return {
    usuarios: null,
    usuarioId: null,
    bonosDeUsuario: [],
    mostrarTablaBonosUsuario: false,
    mostrarTablaReservasUsuario: false,
    mostrarTablaWalletUsuario: false,
    cargando: false,
    error: null,
  };
}