export interface VistaClase {
  id: number;
  nombre: string;

  fecha: string;      // 'YYYY-MM-DD'
  hora: string;       // 'HH:MM'

  plazas: number;
  aforo_clase: number;
  completa: boolean;
  
  tipoclase_nombre?: string;

  profesor?: string | null;
  sala?: string | null;

  // fallbacks que la vista usa con bracket notation
  teacher?: any;
  room?: any;

  // reserva del usuario autenticado (si la hay)
  reservation_id?: number | null;
}