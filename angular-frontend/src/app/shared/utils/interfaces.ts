import { ReservationService } from "../services/reservation.service";
import { ToastService } from "../services/toast.service";
import { ClaseService } from '../services/clases.service';
import { Alumno } from '../interfaces/alumno.interface';
import { ClasesReservaState } from "../models/reservas.models";


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

