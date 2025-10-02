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
    console.log('🔑 Token encontrado en localStorage:', token);

    if (!token) {
      console.warn('⚠️ No hay token, no se carga el usuario ni las clases');
      return;
    }

    this.auth.getUser().subscribe({
      next: (u) => {
        console.log('✅ Usuario recibido en componente:', u);
        this.state.usuarios = u;
        this.state.usuarioId = Number(u?.id) || null;

        console.log('👉 Estado inicial usuarioId:', this.state.usuarioId);

        console.log('📥 Cargando clases por día...');
        loadClassMonday(this);
        loadClassTuesday(this);
        loadClassWednesday(this);
        loadClassThursday(this);
        loadClassFriday(this);
      },
      error: (e) => {
        console.error('❌ Error obteniendo usuario:', e);
        handleHttpError(e, this.toast, undefined, 'unexpectedError');
      },
    });
  }

  get clasesDelDia() {
    const d = this.state.tablaAbierta;
    const result = d ? this.state.clasesPorDia[d] : [];
    console.log(`📅 Getter clasesDelDia -> día: ${d}`, result);
    return result;
  }

  cargarAlumnos(id: number): void {
    console.log('👥 Cargando alumnos para clase:', id);
    loadAlumnosDeClase(this, id);
  }

  reservar(id: number): void {
    console.log('🟢 Intentando reservar clase con id:', id);
    reservarClase(this, id);
  }

  toggleTabla(dia: Dia) {
    this.state.tablaAbierta =
      this.state.tablaAbierta === dia ? null : dia;
    console.log('🔀 Toggle tabla -> Día abierto ahora:', this.state.tablaAbierta);
  }

  toggleTablaAlumnos(id: number): void {
    if (this.state.mostrarTablaAlumnos && this.state.claseSeleccionadaId === id) {
      console.log('❌ Cerrando tabla de alumnos para clase:', id);
      this.state.mostrarTablaAlumnos = false;
      this.state.claseSeleccionadaId = null;
      return;
    }
    console.log('👀 Abriendo tabla de alumnos para clase:', id);
    this.state.claseSeleccionadaId = id;
    this.cargarAlumnos(id);
  }

  trackByClase = (_: number, c: VistaClase) => {
    console.log('🔎 trackByClase ->', c.id);
    return c.id;
  };
}