import { ReservationService } from "@shared/services/reservation.service";
import { ToastService } from "@shared/services/toast.service";
import { ClaseService } from '@shared/services/clases.service';
import { VistasService } from "@shared/services/vistas.service";
import { ClasesReservaState } from "@shared/models/reservas.models";
import { UsuarioBonosState } from '@shared/models/bonos.models';
import { UsuarioReservasState } from '@shared/models/reservas-usuario.models';
import { UsuarioPagosState } from '@shared/models/pagos-usuario.models';
import { ClasesState } from '@shared/models/clases.models';
import { TipoClaseService } from '@shared/services/tipoclase.service';
import { RoomService } from '@shared/services/room.service';
import { UsersService } from '@shared/services/user.service';



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

  cancelandoId?: number | null;
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


// @shared/utils/context-types.ts
export interface ClasesProfesorContext {
  state: ClasesState;
  claseService: ClaseService;
  reservationService: ReservationService;
  toast: ToastService;
}
