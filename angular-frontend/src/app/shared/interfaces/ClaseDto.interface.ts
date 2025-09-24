export interface ClaseDto {
  id: number;
  nombre: string;
  aforo_clase: number;
  plazas: number;
  fecha: string;
  hora: string;
  dia: string;
  completa: boolean;
  profesor?: string | null;
  sala?: string | null;
  teacher?: string | null;
  room?: string | null;
}

export interface ClaseDto {
  id: number;
  nombre: string;
  aforo_clase: number;
  plazas: number;
  fecha: string;
  hora: string;
  dia: string;
  completa: boolean;
  profesor?: string | null;
  sala?: string | null;
  // opcionalmente:
  teacher?: string | null;
  room?: string | null;
}