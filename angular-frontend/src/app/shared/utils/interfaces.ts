import { ReservationService } from "../services/reservation.service";
import { ToastService } from "../services/toast.service";
import { ClaseService } from '../services/clases.service';
import { VistasService } from "../services/vistas.service";
import { ClasesReservaState } from "../models/reservas.models";
import { UsuarioBonosState } from '../models/bonos.models';
import { UsuarioReservasState } from '../models/reservas-usuario.models';
import { UsuarioPagosState } from '../models/pagos-usuario.models';
import { ClasesState } from '../models/clases.models';
import { TipoClaseService } from '../services/tipoclase.service';
import { RoomService } from '../services/room.service';
import { UsersService } from '../services/user.service';



export interface ReservarClaseContext {

  state: ClasesReservaState;

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
  auth?: any; 
  toast: ToastService;
}

export interface UsuarioReservasContext {
  state: UsuarioReservasState;
  vistas: VistasService;
  reservationService: ReservationService;
  toast: ToastService;
}


export interface UsuarioPagosContext {
  state: UsuarioPagosState;
  vistas: VistasService;
  toast: ToastService;

  usuarios?: any[];
  usuarioSeleccionadoId?: number | null;
  usuarioSeleccionado?: any | null;
  walletUser?: any[];
}

export interface CrearClaseContext {
  state: ClasesState;
  claseService: ClaseService;
  tipoClaseService: TipoClaseService;
  roomService: RoomService;
  usersService: UsersService;
  toast: ToastService;
}


export interface ClasesProfesorContext {
  state: ClasesState;
  claseService: ClaseService;
  reservationService: ReservationService;
  toast: ToastService;
}