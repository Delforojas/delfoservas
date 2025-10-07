import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ClaseService } from '../services/clases.service';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router'; 
import { ClaseDto } from '../interfaces/ClaseDto.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import { Alumno } from '../interfaces/alumno.interface';


@Component({
  selector: 'app-aside-profesor',
  standalone: true,
  imports: [CommonModule,  RouterModule],
  templateUrl: '../../shared/components/aside-profesor.html', 
})
export class AsideProfesorComponent implements OnInit {
  usuarios: any = null;
  usuarioId: number | null = null;
  clases: ClaseDto[] = [];
  

 clasesL: VistaClase[] = [];
 clasesM: VistaClase[] = [];
 clasesX: VistaClase[] = [];
 clasesJ: VistaClase[] = [];
 clasesV: VistaClase[] = [];


 tablaAbierta: 'L' | 'M' | 'X' | 'J' | 'V' | null = null;

 cancelandoId: number | null = null;

toggleTabla(dia: 'L' | 'M' | 'X' | 'J' | 'V') {
  this.tablaAbierta = this.tablaAbierta === dia ? null : dia;
}
 
  usuario$!: Observable<any>; 
  mostrarTablaL = false;
  mostrarTablaM = false;
  mostrarTablaX = false;
  mostrarTablaJ = false;
  mostrarTablaV = false;


  mostrarTablaAlumnos = false;
  claseSeleccionadaId: number | null = null;
  alumnos: Alumno[] = []; 
  cargandoAlumnos = false;
  errorAlumnos: string | null = null;

  diaSeleccionado: string | null = null;

  reservandoId: number | null = null;

   mostrarMenu = false;
   mostrarMenuAdmin = false;

  

 seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
  }

  constructor(
    private reservasService: ReservationService,
    private claseService: ClaseService,
    public auth : AuthService
  ) {}

  ngOnInit(): void {
    this.cargarClases();
    this.cargarClasesLunes();
    this.cargarClasesMartes();
    this.cargarClasesMiercoles();
    this.cargarClasesJueves();
    this.cargarClasesViernes();

    this.auth.getUser().subscribe({
      next: (u) => {
        this.usuarios = u;
        this.usuarioId = Number(u?.id) || null; 
      },
      error: (e) => console.error('Error cargando usuario', e),
    });
   

  }

  cargarClases(): void {
    this.claseService.getClases().subscribe((data: ClaseDto[]) => {
      this.clases = data;
    });
  }

  cargarClasesLunes(): void {
    this.reservasService.getClassMonday().subscribe((data: VistaClase[]) => {
      this.clasesL = data;
    });
  }
  cargarClasesMartes(): void {
    this.reservasService.getClassTuesday().subscribe((data: VistaClase[]) => {
      this.clasesM = data;
    });
  }
  cargarClasesMiercoles(): void {
    this.reservasService.getClassWednesday().subscribe((data: VistaClase[]) => {
      this.clasesX = data;
    });
  }
  cargarClasesJueves(): void {
    this.reservasService.getClassThursday().subscribe((data: VistaClase[]) => {
      this.clasesJ = data;
    });
  }
  cargarClasesViernes(): void {
    this.reservasService.getClassFriday().subscribe((data: VistaClase[]) => {
      this.clasesV = data;
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
    error: (err) => {
      console.error('Error cargando alumnos:', err);
      this.errorAlumnos = 'No se pudieron cargar los alumnos';
      this.cargandoAlumnos = false;
    }
  });
}
reservar(id: number): void {
  const claseId = Number(id);
  if (!Number.isFinite(claseId) || claseId <= 0) {
    alert('ID de clase inválido');
    return;
  }

  this.reservandoId = claseId;

  this.reservasService.reservarClase(claseId).subscribe({
    next: () => {
      
      if (this.mostrarTablaL) this.cargarClasesLunes();
      if (this.mostrarTablaM) this.cargarClasesMartes();
      if (this.mostrarTablaX) this.cargarClasesMiercoles();
      if (this.mostrarTablaJ) this.cargarClasesJueves();
      if (this.mostrarTablaV) this.cargarClasesViernes();

      
      if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === claseId) {
        this.cargarAlumnos(claseId);
      }
    },
    error: (err) => {
      const msg = err?.error?.error ?? 'Error al reservar';
      alert(msg);
    },
    complete: () => {
      this.reservandoId = null;
    }
  });
}

toggleTablaL() {
    this.mostrarTablaL = !this.mostrarTablaL;
  }
toggleTablaM() {
    this.mostrarTablaM = !this.mostrarTablaM;
  }
toggleTablaX() {
    this.mostrarTablaX = !this.mostrarTablaX;
  }
toggleTablaJ() {
    this.mostrarTablaJ = !this.mostrarTablaJ;
  }
toggleTablaV() {
    this.mostrarTablaV = !this.mostrarTablaV;
  }

toggleTablaAlumnos(id: number): void {

  if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === id) {
    this.mostrarTablaAlumnos = false;
    this.claseSeleccionadaId = null;
    return;
  }
  this.claseSeleccionadaId = id;
  this.cargarAlumnos(id);
}

toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }
  toggleMenuAdmin() {
    this.mostrarMenuAdmin = !this.mostrarMenuAdmin;
  }

eliminarReserva(reservationId: number, claseId?: number): void {
  if (!confirm('¿Seguro que quieres eliminar la reserva?')) return;

  this.cancelandoId = reservationId;
  this.reservasService.eliminarReservation(reservationId).subscribe({
    next: () => {
      
      this.cargarClasesLunes();
      this.cargarClasesMartes();
      this.cargarClasesMiercoles();
      this.cargarClasesJueves();
      this.cargarClasesViernes();

      if (claseId != null && this.mostrarTablaAlumnos && this.claseSeleccionadaId === claseId) {
        this.cargarAlumnos(claseId);
      }

      this.alumnos = this.alumnos.filter(a => a.alumno_reservation_id !== reservationId);
    },
    error: (err) => alert(err?.error?.error ?? 'No se pudo eliminar la reserva'),
    complete: () => this.cancelandoId = null,
  });
}

  trackByClase = (_: number, c: VistaClase) => c.id;


  mostrarAside = true;
  mostrarTabla = false;
  mostrarTablaProfesores = false;

  toggleAside() {
    this.mostrarAside = !this.mostrarAside;
  }

  toggleCrear() {
    
  }

  toggleTablaAdmin() {
    this.mostrarTabla = !this.mostrarTabla;
  }

  toggleTablaProfesores() {
    this.mostrarTablaProfesores = !this.mostrarTablaProfesores;
  }

}

