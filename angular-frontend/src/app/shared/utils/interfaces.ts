import { ReservationService } from "../services/reservation.service";
import { ToastService } from "../services/toast.service";




export interface ReservarClaseContext {
  reservasService: ReservationService;
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