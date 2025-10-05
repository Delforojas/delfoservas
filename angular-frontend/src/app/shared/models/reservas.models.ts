// Ajusta las rutas de import a las tuyas reales
import { Alumno } from '../interfaces/alumno.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import { ClaseDto } from '../interfaces/ClaseDto.interface';



// Letras para los días que ya usas en la UI
export type Dia = 'L' | 'M' | 'X' | 'J' | 'V';

// Si te sirve, mapeo a dayOfWeek de Postgres (0..6)
export const DayOfWeekByDia: Record<Dia, number> = {
  L: 1, // Monday
  M: 2,
  X: 3,
  J: 4,
  V: 5,
};

export interface ClasesReservaState {
  // Usuario
  usuarios: any | null;
  usuarioId: number | null;

  // Colecciones
  clases: ClaseDto[];

  // Clases por día
  clasesPorDia: Record<Dia, VistaClase[]>; // { L:[], M:[], X:[], J:[], V:[] }

  // UI estado
  tablaAbierta: Dia | null;
  cancelandoId: number | null;
  reservandoId: number | null;

  // Alumnos de clase seleccionada
  mostrarTablaAlumnos: boolean;
  claseSeleccionadaId: number | null;
  alumnos: Alumno[];
  cargandoAlumnos: boolean;
  errorAlumnos: string | null;

  // Otros
  diaSeleccionado: Dia | null;

  // Streams si los usas
  usuario$?: unknown; // o el tipo exacto: Observable<Usuario>

}

// Estado inicial para no repetir boilerplate
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