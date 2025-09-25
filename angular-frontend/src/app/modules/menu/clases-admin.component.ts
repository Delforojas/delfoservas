import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { ClaseService } from '../../shared/services/clases.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';

import { Clase } from '../../shared/interfaces/clase.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ClaseProfe } from '../../shared/interfaces/claseProfe.interface';
import { Alumno } from '../../shared/interfaces/alumno.interface';

@Component({
  selector: 'app-clases-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
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
    this.cargarClases();
    this.cargarClasesVista();
    this.cargarClasesProfesores();
  }

  cargarClases(): void {
    this.claseService.getClases().subscribe({
      next: (data: Clase[]) => (this.clases = data),
      error: (e) => handleHttpError(e, this.toast, undefined, 'clasesError'),
    });
  }

  cargarClasesVista(): void {
    this.claseService.getClasesVista().subscribe({
      next: (data: VistaClase[]) => (this.clasesVista = data),
      error: (e) => handleHttpError(e, this.toast, undefined, 'vistaClasesError'),
    });
  }

  cargarClasesProfesores(): void {
    this.cargando = true;
    this.claseService.getMisClases()
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (rows) => (this.clasesprofe = rows),
        error: (e) => handleHttpError(e, this.toast, undefined, 'misClasesError'),
      });
  }

  cargarAlumnos(id: number): void {
    this.cargandoAlumnos = true;
    this.alumnos = [];
    this.claseSeleccionadaId = id;

    this.claseService.getAlumnosDeClase(id)
      .pipe(finalize(() => (this.cargandoAlumnos = false)))
      .subscribe({
        next: (rows) => {
          this.alumnos = rows;
          this.mostrarTablaAlumnos = true;
        },
        error: (e) => handleHttpError(e, this.toast, undefined, 'alumnosError'),
      });
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

  eliminarClase(id: number): void {
    if (!confirm('¿Eliminar esta clase?')) return;

    this.claseService.eliminarClase(id).subscribe({
      next: () => this.cargarClases(),
      error: (e) => handleHttpError(e, this.toast, undefined, 'eliminarClaseError'),
    });
  }

  eliminarAlumnoDeClase(a: Alumno): void {
    if (!a.alumno_reservation_id) {
      // error local de negocio (sin request)
      handleHttpError({ status: 400 } as any, this.toast, undefined, 'eliminarReservaError');
      return;
    }
    if (!confirm(`¿Eliminar la reserva de ${a.alumno_nombre}?`)) return;

    this.eliminandoId = a.alumno_reservation_id;

    this.reservationService.eliminarReservation(a.alumno_reservation_id)
      .pipe(finalize(() => (this.eliminandoId = null)))
      .subscribe({
        next: () => {
          this.alumnos = this.alumnos.filter(x => x.alumno_reservation_id !== a.alumno_reservation_id);
          if (this.claseSeleccionadaId != null) this.cargarAlumnos(this.claseSeleccionadaId);
          this.cargarClasesProfesores();
        },
        error: (e) => handleHttpError(e, this.toast, undefined, 'eliminarReservaError'),
      });
  }
}