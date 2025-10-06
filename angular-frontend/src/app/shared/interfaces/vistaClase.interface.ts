export interface VistaClase {
  id: number;
  nombre: string;

  fecha: string;     
  hora: string;    

  plazas: number;
  aforo_clase: number;
  completa: boolean;
  
  tipoclase_nombre?: string;

  profesor?: string | null;
  sala?: string | null;

  teacher?: any;
  room?: any;

  reservation_id?: number | null;
}