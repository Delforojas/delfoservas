import { ReservationService } from "../services/reservation.service";
import { ToastService } from "../services/toast.service";
import { ClaseService } from '../services/clases.service';
import { VistasService } from "../services/vistas.service";
import { Alumno } from '../interfaces/alumno.interface';
import { ClasesReservaState } from "../models/reservas.models";
import { UsuarioBonosState } from '../models/bonos.models';



export interface ReservarClaseContext {
   // Estado centralizado de la pantalla
  state: ClasesReservaState;

  // Servicios que usan las utils
  reservasService: ReservationService;
  claseService: ClaseService;
  toast: ToastService;
  

  mostrarTablaL?: boolean;
  mostrarTablaM?: boolean;
  mostrarTablaX?: boolean;
  mostrarTablaJ?: boolean;
  mostrarTablaV?: boolean;
  mostrarTablaAlumnos?: boolean;

  claseSeleccionadaId?: number | null;
  reservandoId?: number | null;
}

export interface UsuarioBonosContext {
  state: UsuarioBonosState;
  vistas: VistasService;
  auth?: any; // opcional si lo usas aquí
  toast: ToastService;
}