import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClaseService, Clase , VistaClase , ClaseProfe , Alumno} from '../../shared/services/clases.service';
import { TipoClaseService, TipoClase } from '../../shared/services/tipoclase.service';
import { RoomService, Room } from '../../shared/services/room.service';
import { UsersService, Profesor } from '../../shared/services/users.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';



import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-clase',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule , RouterModule],
  templateUrl: './clase.html',
  styleUrls: ['./clase.component.css']
})
export class ClaseComponent implements OnInit {
  clasesVista: VistaClase[] = [];
  clases: Clase[] = [];



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

  tiposClase: TipoClase[] = [];
  rooms: Room[] = [];          
  profesores: Profesor[] = [];

  clasesprofe: ClaseProfe[] = [];
  alumnos: Alumno[] = []; 
  
  cargandoAlumnos = false;
  errorAlumnos: string | null = null;


  mostrarTabla = false;
  mostrarTablaProfesores = false;
  mostrarTablaAlumnos = false;
  
mostrarAside = false;

  
  mostrarFormularioCrearClase=false;


   constructor(
    private claseService: ClaseService,
    private tipoClaseService: TipoClaseService ,
    private roomService: RoomService,
    private usersService: UsersService,
    private reservationService: ReservationService,
    public auth: AuthService
    

    // 👈 inyectas el servicio
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
      error: () => this.error = 'Error al cargar clases'
    });
  }
  cargarClasesVista(): void {
    this.claseService.getClasesVista().subscribe({ // <-- endpoint vista_clases
      next: (data: VistaClase[]) => this.clasesVista = data,
      error: () => this.error = 'Error al cargar vista de clases'
    });
  }

  
 cargarTiposClase(): void {
    this.tipoClaseService.getTipos().subscribe({
      next: (res: TipoClase[]) => this.tiposClase = res,
      error: (e: any) => console.error('Error cargando tipos de clase', e)
    });
  }

 cargarRooms(): void {
  this.roomService.getRooms().subscribe({
    next: (res: Room[]) => this.rooms = res,
    error: (e) => console.error('Error cargando salas', e)
  });
}

cargarProfesores(): void {
  this.usersService.getProfesores().subscribe({
    next: (res: Profesor[]) => this.profesores = res,
    error: (e) => console.error('Error cargando profesores', e)
  });
}

cargarClasesProfesores(): void {
    this.cargando = true;
    this.error = null;
    this.claseService.getMisClases().subscribe({
      next: (rows) => { this.clasesprofe = rows; this.cargando = false; },
      error: (e) => { this.error = 'No se pudieron cargar tus clases'; this.cargando = false; }
    });
  }

cargarAlumnos(id: number): void {
  console.log('Entrando a cargarAlumnos con id:', id);

  this.cargandoAlumnos = true;
  this.errorAlumnos = null;
  this.alumnos = [];
  this.claseSeleccionadaId = id;

  this.claseService.getAlumnosDeClase(id).subscribe({
    next: (rows) => {
      console.log('Alumnos recibidos:', rows);
      this.alumnos = rows;
      this.mostrarTablaAlumnos = true;
      this.cargandoAlumnos = false;
    },
    error: (err) => {
      console.error('Error cargando alumnos:', err);
      this.errorAlumnos = 'No se pudieron cargar los alumnos';
      this.cargandoAlumnos = false;
    }
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
    fecha: (c.fecha ?? '').trim(), // esperado YYYY-MM-DD
    hora: (c.hora ?? '').trim(),   // esperado HH:mm
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


    alert('Completa correctamente: ' + errores.join(', '));
    console.warn('Valores recibidos en nuevaClase:', this.nuevaClase);
    console.warn('Payload normalizado:', payload);
    return;
  }

  // 3) Enviar
  this.claseService.crearClase(payload).subscribe({
    next: () => {
      this.nuevaClase = { nombre: '', tipoclase: 0, teacher: 0, fecha: '', hora: '', aforo_clase: 0, room: 0 };
      this.cargarClases();
    },
    error: (err) => {
      this.error = 'Error al crear la clase';
      console.error(err);
    }
  });
}

toggleCrear() {
  this.mostrarFormularioCrearClase = true;
  this.mostrarTabla = false;
  this.mostrarTablaProfesores = false;
}

toggleTabla() {
  this.mostrarTabla = !this.mostrarTabla;
  if (this.mostrarTabla) {
    this.mostrarFormularioCrearClase = false;
    this.mostrarTablaProfesores = false;
  }
}

toggleTablaProfesores() {
  this.mostrarTablaProfesores = !this.mostrarTablaProfesores;
  if (this.mostrarTablaProfesores) {
    this.mostrarFormularioCrearClase = false;
    this.mostrarTabla = false;
  }
}

toggleTablaAlumnos(id: number): void {

  if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === id) {
    this.mostrarTablaAlumnos = false;
    this.claseSeleccionadaId = null;
    return;
  }
  this.cargarAlumnos(id);
}

toggleAside() {
  this.mostrarAside = !this.mostrarAside;
}

  eliminarClase(id: number): void {
    if (confirm('¿Eliminar esta clase?')) {
      this.claseService.eliminarClase(id).subscribe({
        next: () => this.cargarClases(),
        error: (err) => {
          this.error = 'Error al eliminar la clase';
          console.error(err);
        }
      });
    }
  }

eliminandoId: number | null = null;

eliminarAlumnoDeClase(a: Alumno): void {
  if (!a.alumno_reservation_id) {
    alert('No se encontró la reserva de este alumno.');
    return;
  }
  if (!confirm(`¿Eliminar la reserva de ${a.alumno_nombre}?`)) return;

  this.eliminandoId = a.alumno_reservation_id;

  this.reservationService.eliminarReservation(a.alumno_reservation_id).subscribe({
    next: () => {
      // Quita de la UI inmediatamente
      this.alumnos = this.alumnos.filter(x => x.alumno_reservation_id !== a.alumno_reservation_id);

      // Refresca la subtabla por si el backend recalcula algo
      if (this.claseSeleccionadaId != null) {
        this.cargarAlumnos(this.claseSeleccionadaId);
      }
       this.cargarClasesProfesores();
    },
    error: (err) => {
      console.error('Error eliminando reserva', err);
      alert(err?.error?.error ?? 'No se pudo eliminar la reserva');
    },
    complete: () => this.eliminandoId = null
  });
}
}