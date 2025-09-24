export interface BonoActivoUsuario {
  usuario_id: number;
  usuario_nombre: string;
  email: string;
  bono_id: number;
  tipoclase: number;
  clases_totales: number;
  clases_restantes: number;
  estado: 'activo' | 'inactivo' | string; // ajusta si solo usas 'activo'
  fecha_wallet: string; // YYYY-MM-DD
}

export interface BonoActivoUsuario {
  usuario_id: number;
  usuario_nombre: string;
  email: string;
  bono_id: number;
  tipoclase: number;
  clases_totales: number;
  clases_restantes: number;
  estado: 'activo' | 'inactivo' | string; // ajusta si solo usas 'activo'
  fecha_wallet: string; // YYYY-MM-DD
}
