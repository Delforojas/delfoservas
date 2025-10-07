import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaseService } from '../../shared/services/clases.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';

import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';

import { ReservarClaseContext } from '../../shared/utils/interfaces';

import {
  
  loadClassMonday,
  loadClassTuesday,
  loadClassWednesday,
  loadClassThursday,
  loadClassFriday,
  loadAlumnosDeClase,
  reservarClase,
} from '../../shared/utils/load';

import {
  ClasesReservaState,
  Dia,
  createInitialClasesReservaState,
} from '../../shared/models/reservas.models';

@Component({
  selector: 'app-reservar-clases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservar-clases.html',
})
export class ClasesReservaComponent implements OnInit, ReservarClaseContext {
  state: ClasesReservaState = createInitialClasesReservaState();

  constructor(
    public reservasService: ReservationService,
    public claseService: ClaseService,
    public auth: AuthService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
   
    if (!token) {
      console.warn('⚠️ No hay token, no se carga el usuario ni las clases');
      return;
    }

    this.auth.getUser().subscribe({
      next: (u) => {
        
        this.state.usuarios = u;
        this.state.usuarioId = Number(u?.id) || null;

        loadClassMonday(this);
        loadClassTuesday(this);
        loadClassWednesday(this);
        loadClassThursday(this);
        loadClassFriday(this);
      },
      error: (e) => {
        handleHttpError(e, this.toast, undefined, 'unexpectedError');
      },
    });
  }

  get clasesDelDia() {
    const d = this.state.tablaAbierta;
    const result = d ? this.state.clasesPorDia[d] : [];
    return result;
  }

  cargarAlumnos(id: number): void {
    loadAlumnosDeClase(this, id);
  }

  reservar(id: number): void {
    reservarClase(this, id);
  }

  toggleTabla(dia: Dia) {
    this.state.tablaAbierta =
      this.state.tablaAbierta === dia ? null : dia;
  }

  toggleTablaAlumnos(id: number): void {
    if (this.state.mostrarTablaAlumnos && this.state.claseSeleccionadaId === id) {
      this.state.mostrarTablaAlumnos = false;
      this.state.claseSeleccionadaId = null;
      return;
    }
    this.state.claseSeleccionadaId = id;
    this.cargarAlumnos(id);
  }

  trackByClase = (_: number, c: VistaClase) => {
    return c.id;
  };
}