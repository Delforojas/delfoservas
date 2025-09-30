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


import {
  loadClasesReserva,
  loadClasesLunes,
  loadClasesMartes,
  loadClasesMiercoles,
  loadClasesJueves,
  loadClasesViernes,
  loadAlumnosDeClase,
  reservarClase,
} from '../../shared/utils/load';


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
  // carga las clases del lunes y abre directamente la tabla de Lunes
  loadClasesLunes(this);
  loadClasesMartes(this);
  loadClasesMiercoles(this);
  loadClasesJueves(this);
  loadClasesViernes(this);

  this.auth.getUser().subscribe({
    next: (u) => {
      this.usuarios = u;
      this.usuarioId = Number(u?.id) || null;
    },
    error: (e) => handleHttpError(e, this.toast, undefined, 'unexpectedError'),
  });
}
  /*ngOnInit(): void {
  loadClasesReserva(this);
  loadClasesLunes(this);
  loadClasesMartes(this);
  loadClasesMiercoles(this);
  loadClasesJueves(this);
  loadClasesViernes(this);

  this.auth.getUser().subscribe({
    next: (u) => {
      this.usuarios = u;
      this.usuarioId = Number(u?.id) || null;
    },
    error: (e) => handleHttpError(e, this.toast, undefined, 'unexpectedError'),
  });
}*/

cargarAlumnos(id: number): void {
  loadAlumnosDeClase(this, id);
}

reservar(id: number): void {
  reservarClase(this, id);
}


toggleTabla(dia: 'L' | 'M' | 'X' | 'J' | 'V') {
  if (this.tablaAbierta === dia) {
    this.tablaAbierta = null;
  } else {
    this.tablaAbierta = dia;
  }
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