import { Alumno } from '../interfaces/alumno.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import { ClaseDto } from '../interfaces/ClaseDto.interface';

export type Dia = 'L' | 'M' | 'X' | 'J' | 'V';


export const DayOfWeekByDia: Record<Dia, number> = {
  L: 1, 
  M: 2,
  X: 3,
  J: 4,
  V: 5,
};

export interface ClasesReservaState {

  usuarios: any | null;
  usuarioId: number | null;

  clases: ClaseDto[];


  clasesPorDia: Record<Dia, VistaClase[]>; 

  tablaAbierta: Dia | null;
  cancelandoId: number | null;
  reservandoId: number | null;

  mostrarTablaAlumnos: boolean;
  claseSeleccionadaId: number | null;
  alumnos: Alumno[];
  cargandoAlumnos: boolean;
  errorAlumnos: string | null;

  diaSeleccionado: Dia | null;

  usuario$?: unknown; 

}

export function createInitialClasesReservaState(): ClasesReservaState {
  return {
    usuarios: null,
    usuarioId: null,

    clases: [],
    clasesPorDia: { L: [], M: [], X: [], J: [], V: [] },

    tablaAbierta: null,
    cancelandoId: null,
    reservandoId: null,

    mostrarTablaAlumnos: false,
    claseSeleccionadaId: null,
    alumnos: [],
    cargandoAlumnos: false,
    errorAlumnos: null,

    diaSeleccionado: null,

    usuario$: undefined,
  };
}