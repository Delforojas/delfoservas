import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ClaseService } from '../../shared/services/clases.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';

import { Alumno } from '../../shared/interfaces/alumno.interface';
import { ClaseDto } from '../../shared/interfaces/ClaseDto.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';


// Standalone children

type Dia = 'L'|'M'|'X'|'J'|'V';


@Component({
  selector: 'app-reservar-clases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservar-clases.html' ,
  
})
export class ClasesReservaComponent implements OnInit {
  
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



 get clasesDelDia(): VistaClase[] {
  switch (this.tablaAbierta) {
    case 'L': return this.clasesL;
    case 'M': return this.clasesM;
    case 'X': return this.clasesX;
    case 'J': return this.clasesJ;
    case 'V': return this.clasesV;
    default:  return [];
  }
}

toggleTabla(dia: Dia) {
  this.tablaAbierta = dia;
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


 seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
  }

  constructor(
    private reservasService: ReservationService,
    private claseService: ClaseService,
    public auth: AuthService,
    private toast :ToastService
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
        this.usuarioId = Number(u?.id) || null; // ajusta si tu API usa otro nombre
      },
      error: (e) => handleHttpError(e, this.toast, undefined, 'unexpectedError'),
    });
   

  }

  cargarClases(): void {
    this.reservasService.getClases().subscribe((data: ClaseDto[]) => {
      this.clases = data;
    });
  }

 cargarClasesLunes(): void {
    this.reservasService.getClasesLunes().subscribe({
      next: (data) => this.clasesL = [...data],
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
    });
  }
  cargarClasesMartes(): void {
    this.reservasService.getClasesMartes().subscribe({
      next: (data) => this.clasesM = [...data],
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
    });
  }
  cargarClasesMiercoles(): void {
    this.reservasService.getClasesMiercoles().subscribe({
      next: (data) => this.clasesX = [...data],
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
    });
  }
  cargarClasesJueves(): void {
    this.reservasService.getClasesJueves().subscribe({
      next: (data) => this.clasesJ = [...data],
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
    });
  }
  cargarClasesViernes(): void {
    this.reservasService.getClasesViernes().subscribe({
      next: (data) => this.clasesV = [...data],
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
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
reservar(id: number): void {
  const claseId = Number(id);
  if (!Number.isFinite(claseId) || claseId <= 0) {
    handleHttpError({ status: 400 } as any, this.toast, undefined, 'reservarError');
    return;
  }

  this.reservandoId = claseId;

  this.reservasService.reservarClase(claseId).subscribe({
    next: () => {
      handleHttpError({ status: 200 } as any, this.toast, undefined, 'reservarSuccess');
      if (this.mostrarTablaL) this.cargarClasesLunes();
      if (this.mostrarTablaM) this.cargarClasesMartes();
      if (this.mostrarTablaX) this.cargarClasesMiercoles();
      if (this.mostrarTablaJ) this.cargarClasesJueves();
      if (this.mostrarTablaV) this.cargarClasesViernes();

      // Si la subtabla de alumnos está abierta para esa clase, recárgala
      if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === claseId) {
        this.cargarAlumnos(claseId);
      }
    },
    error: (e) => handleHttpError(e, this.toast, undefined, 'reservarError'),
    
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




  trackByClase = (_: number, c: VistaClase) => c.id;


}