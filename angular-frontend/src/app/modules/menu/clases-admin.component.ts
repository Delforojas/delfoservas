import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { ClaseService } from '../../shared/services/clases.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { ToastService } from '../../shared/services/toast.service';

import { Clase } from '../../shared/interfaces/clase.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ClaseProfe } from '../../shared/interfaces/claseProfe.interface';
import { Alumno } from '../../shared/interfaces/alumno.interface';

import { loadClases, loadClasesVista, loadClasesProfesores, loadAlumnos, deleteClase, deleteAlumnoDeClase } 
  from '../../shared/utils/load';


@Component({
  selector: 'app-clases-admin',
  standalone: true,
  imports: [CommonModule,  RouterModule],
  templateUrl: './clases-admin.html',
})
export class ClasesAdminComponent implements OnInit {
  clasesVista: VistaClase[] = [];
  clases: Clase[] = [];

  cargando = false;

  claseSeleccionadaId: number | null = null;

  clasesprofe: ClaseProfe[] = [];
  alumnos: Alumno[] = [];

  cargandoAlumnos = false;
  eliminandoId: number | null = null;

  mostrarTabla = false;
  mostrarTablaProfesores = false;
  mostrarTablaAlumnos = false;

  constructor(
    private claseService: ClaseService,
    private reservationService: ReservationService,
    public  auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    loadClases(this);
    loadClasesVista(this);
    loadClasesProfesores(this);
  }


  cargarAlumnos(id: number): void {
    loadAlumnos(this, id);
  }

  eliminarClase(id: number): void {
    deleteClase(this, id);
  }

  eliminarAlumnoDeClase(a: Alumno): void {
    deleteAlumnoDeClase(this, a);
  }

  toggleTabla(): void {
    this.mostrarTabla = !this.mostrarTabla;
    if (this.mostrarTabla) this.mostrarTablaProfesores = false;
  }

  toggleTablaProfesores(): void {
    this.mostrarTablaProfesores = !this.mostrarTablaProfesores;
    if (this.mostrarTablaProfesores) this.mostrarTabla = false;
  }

  toggleTablaAlumnos(id: number): void {
    if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === id) {
      this.mostrarTablaAlumnos = false;
      this.claseSeleccionadaId = null;
      return;
    }
    this.cargarAlumnos(id);
  }

}