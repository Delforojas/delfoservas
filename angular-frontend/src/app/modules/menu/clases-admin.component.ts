import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ClaseService } from '../../shared/services/clases.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { ToastService } from '../../shared/services/toast.service';

import { Alumno } from '../../shared/interfaces/alumno.interface';

import {
  loadClases,
  loadClasesVista,
  loadAlumnos,
  deleteClase,
  deleteAlumnoDeClase,
} from '../../shared/utils/load';

import {
  ClasesState,
  createInitialClasesState,
} from '../../shared/models/clases.models';

@Component({
  selector: 'app-clases-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clases-admin.html',
})
export class ClasesAdminComponent implements OnInit {
  state: ClasesState = createInitialClasesState();

  constructor(
    public claseService: ClaseService,
    public reservationService: ReservationService,
    public auth: AuthService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    
    loadClasesVista(this);
   
  }

  cargarAlumnos(id: number): void {
    loadAlumnos(this, id);
  }

  eliminarClase(id: number): void {
    deleteClase(this, id);
  }

  eliminarAlumnoDeClase(a: Alumno | any): void {
    deleteAlumnoDeClase(this, a);
  }

  toggleTabla(): void {
    this.state.mostrarTabla = !this.state.mostrarTabla;
    if (this.state.mostrarTabla) this.state.mostrarTablaProfesores = false;
  }

  toggleTablaProfesores(): void {
    this.state.mostrarTablaProfesores = !this.state.mostrarTablaProfesores;
    if (this.state.mostrarTablaProfesores) this.state.mostrarTabla = false;
  }

  toggleTablaAlumnos(id: number): void {
    if (this.state.mostrarTablaAlumnos && this.state.claseSeleccionadaId === id) {
      this.state.mostrarTablaAlumnos = false;
      this.state.claseSeleccionadaId = null;
      return;
    }
    this.cargarAlumnos(id);
  }
}