export interface VistaClase {
  id: number;
  nombre: string;
  aforo_clase: number;
  fecha: string;   
  hora: string;    
  dia: string;   
  tipoclase_id: number;
  tipoclase_nombre: string;
  reservas: number;
  plazas: number;
  completa: boolean;
  profesor?: string | null;
  sala?: string | null;
  teacher?: number;
  room?: number;
  usuario_id?: number | null;
  reservation_id?: number | null;
}