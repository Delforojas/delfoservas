import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ClaseService } from '../../shared/services/clases.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { Alumno } from '../../shared/interfaces/alumno.interface';

import {
  loadClases,
  loadClasesVista,
  loadClasesProfesores,
  loadAlumnos,
  deleteClase,
  deleteAlumnoDeClase,
} from '../../shared/utils/loads/clase-profesor.load';

import {
  ClasesState,
  createInitialClasesState,
} from '../../shared/models/clases.models';

import { ClasesProfesorContext } from '../../shared/utils/context-types';

@Component({
  selector: 'app-clases-profesor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './clases-profesor.html',
})
export class ClasesProfesorComponent implements OnInit, ClasesProfesorContext {
  state = createInitialClasesState();

  constructor(
    public claseService: ClaseService,
    public reservationService: ReservationService,
    public auth: AuthService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    loadClasesVista(this);
    loadClasesProfesores(this);
  }

  eliminarClase(id: number) { deleteClase(this, id); }
  eliminarAlumnoDeClase(a: any) { deleteAlumnoDeClase(this, a); }

  toggleTablaAlumnos(id: number) {
    if (this.state.mostrarTablaAlumnos && this.state.claseSeleccionadaId === id) {
      this.state.mostrarTablaAlumnos = false;
      this.state.claseSeleccionadaId = null;
      return;
    }
    loadAlumnos(this, id);
  }

  trackByClase = (_: number, c: VistaClase) => c.id;
  trackByAlumno = (_: number, a: Alumno) => (a as any).alumno_id ?? `${(a as any).alumno_nombre}-${(a as any).alumno_email}`;
}