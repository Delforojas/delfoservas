import { Clase } from '../interfaces/clase.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import { TipoClase } from '../interfaces/tipoClase.interface';
import { Room } from '../interfaces/room.interface';
import { Profesor } from '../interfaces/profesor.interface';
import { Alumno } from '../interfaces/alumno.interface';
import { ClaseDto } from '../interfaces/ClaseDto.interface';


export interface ClasesState {
  clases: ClaseDto[];
  clasesVista: VistaClase[];
  tiposClase: TipoClase[];
  rooms: Room[];
  profesores: Profesor[];
  clasesProfe: any[];
  alumnos: Alumno[];

  nuevaClase: Omit<Clase, 'id'>;
  claseSeleccionadaId: number | null;

  mostrarTabla: boolean;
  mostrarTablaProfesores: boolean;
  mostrarTablaAlumnos: boolean;

  cargando: boolean;
  cargandoAlumnos: boolean;
  error: string | null;
  errorAlumnos: string | null;
 eliminandoId: number | null; 

}

export function createInitialClasesState(): ClasesState {
  return {
    clases: [],
    clasesVista: [],
    tiposClase: [],
    rooms: [],
    profesores: [],
    clasesProfe: [],
    alumnos: [],

    nuevaClase: {
      nombre: '',
      tipoclase: 0,
      teacher: 0,
      fecha: '',
      hora: '',
      aforo_clase: 0,
      room: 0,
    },
    claseSeleccionadaId: null,

    mostrarTabla: false,
    mostrarTablaProfesores: false,
    mostrarTablaAlumnos: false,

    cargando: false,
    cargandoAlumnos: false,
    error: null,
    errorAlumnos: null,
    eliminandoId: null,
  };
}