import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClaseService} from '../../shared/services/clases.service';
import { TipoClaseService} from '../../shared/services/tipoclase.service';
import { RoomService } from '../../shared/services/room.service';
import { UsersService} from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';

import { Clase } from '../../shared/interfaces/clase.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ClaseProfe } from '../../shared/interfaces/claseProfe.interface';
import { TipoClase } from '../../shared/interfaces/tipoClase.interface';
import { Alumno } from '../../shared/interfaces/alumno.interface';
import { Room } from '../../shared/interfaces/room.interface';
import { Profesor } from '../../shared/interfaces/profesor.interface';




import { RouterModule } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';



@Component({
  selector: 'app-crear-clase',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule , RouterModule],
  templateUrl: './crear-clase.html',
  
})
export class CrearClaseComponent implements OnInit {
  clasesVista: VistaClase[] = [];
  clases: Clase[] = [];
   tiposClase: TipoClase[] = [];
  rooms: Room[] = [];          
  profesores: Profesor[] = [];
  clasesprofe: ClaseProfe[] = [];
  alumnos: Alumno[] = []; 

  nuevaClase: Omit<Clase, 'id'> = {
    nombre: '',
    tipoclase: 0,
    teacher: 0,
    fecha: '',
    hora: '',
    aforo_clase: 0,
    room: 0
  };
  cargando = false;
  error: string | null = null;

  claseSeleccionadaId: number | null = null;

  cargandoAlumnos = false;
  errorAlumnos: string | null = null;

  mostrarTabla = false;
  mostrarTablaProfesores = false;
  mostrarTablaAlumnos = false;

   constructor(
    private claseService: ClaseService,
    private tipoClaseService: TipoClaseService ,
    private roomService: RoomService,
    private usersService: UsersService,
    public auth: AuthService,
    private toast :ToastService
    


  ) {}

  ngOnInit(): void {
    this.cargarClases();
    this.cargarClasesVista(); 
    this.cargarTiposClase(); 
    this.cargarRooms();
    this.cargarProfesores();
    this.cargarClasesProfesores();

}

  cargarClases(): void {
    this.claseService.getClases().subscribe({ // <-- endpoint normal (tabla)
      next: (data: Clase[]) => this.clases = data,
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
    });
  }
  cargarClasesVista(): void {
    this.claseService.getClasesVista().subscribe({ // <-- endpoint vista_clases
      next: (data: VistaClase[]) => this.clasesVista = data,
      error: (e) => handleHttpError(e, this.toast, undefined, 'vistaClasesError'),
    });
  }

  
 cargarTiposClase(): void {
    this.tipoClaseService.getTipos().subscribe({
      next: (res: TipoClase[]) => this.tiposClase = res,
      error: (e) => handleHttpError(e, this.toast, undefined, 'tiposClaseError'),

    });
  }

 cargarRooms(): void {
  this.roomService.getRooms().subscribe({
    next: (res: Room[]) => this.rooms = res,
    error: (e) => handleHttpError(e, this.toast, undefined, 'roomsError'),
  });
}

cargarProfesores(): void {
  this.usersService.getProfesores().subscribe({
    next: (res: Profesor[]) => this.profesores = res,
    error: (e) => handleHttpError(e, this.toast, undefined, 'profesoresError'),
  });
}

cargarClasesProfesores(): void {
    this.cargando = true;
    this.error = null;
    this.claseService.getMisClases().subscribe({
      next: (rows) => { this.clasesprofe = rows; this.cargando = false; },
      error: (e) => handleHttpError(e, this.toast, undefined, 'misClasesError'),
    });
  }

cargarAlumnos(id: number): void {
  this.cargandoAlumnos = true;
  this.errorAlumnos = null;
  this.alumnos = [];
  this.claseSeleccionadaId = id;

  this.claseService.getAlumnosDeClase(id).subscribe({
    next: (rows) => {
      this.alumnos = rows;
      this.mostrarTablaAlumnos = true;
      this.cargandoAlumnos = false;
    },
     error: (e) => handleHttpError(e, this.toast, undefined, 'alumnosError'),
  });
}

  

crearClase(): void {
  const c = this.nuevaClase;

  // 1) Normaliza tipos (los select/input suelen traer strings)
  const payload = {
    ...c,
    tipoclase: Number(c.tipoclase),
    teacher: Number(c.teacher),
    aforo_clase: Number(c.aforo_clase),
    room: Number(c.room),
    nombre: (c.nombre ?? '').trim(),
    fecha: (c.fecha ?? '').trim(), 
    hora: (c.hora ?? '').trim(),   
  };

  // 2) Valida campo a campo y di cuál falla
  const errores: string[] = [];
  if (!payload.nombre) errores.push('nombre');
  if (!payload.fecha) errores.push('fecha');
  if (!payload.hora) errores.push('hora');
  if (!Number.isFinite(payload.tipoclase) || payload.tipoclase <= 0) errores.push('tipoclase');
  if (!Number.isFinite(payload.teacher)   || payload.teacher   <= 0) errores.push('teacher');
  if (!Number.isFinite(payload.aforo_clase) || payload.aforo_clase <= 0) errores.push('aforo_clase');
  if (!Number.isFinite(payload.room) || payload.room <= 0) errores.push('room');

  if (errores.length) {
    handleHttpError({ status: 400 } as any, this.toast, undefined, 'crearClaseFormInvalid');
    console.warn('Campos inválidos:', errores.join(', '), { payload });
    return;
  }

  // 3) Enviar
  this.claseService.crearClase(payload).subscribe({
    next: () => {
      this.nuevaClase = { nombre: '', tipoclase: 0, teacher: 0, fecha: '', hora: '', aforo_clase: 0, room: 0 };
      this.cargarClases();
    },
   
    error: (e) => handleHttpError(e, this.toast, undefined, 'crearClaseError'),
  });
}



}