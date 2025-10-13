import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaseService } from '../../shared/services/clases.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { AuthService } from '../../shared/services/auth.service';

import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';

import {
  
  loadClassMonday,
  loadClassTuesday,
  loadClassWednesday,
  loadClassThursday,
  loadClassFriday,
  loadAlumnosDeClase,
  reservarClase,
  deleteReserva
} from '../../shared/utils/loads/reservar-clase.load';

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
  styleUrl: './reservar-clases.css'
})
export class ClasesReservaComponent implements OnInit{
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
    const dia = this.state.tablaAbierta;
    const result = dia ? this.state.clasesPorDia[dia] : [];
    return result;
  }

  cargarAlumnos(id: number): void {
    loadAlumnosDeClase(this, id);
  }

  reservar(id: number): void {
    reservarClase(this, id);
  } 

  delete(reservaId: number, claseId: number): void {
  deleteReserva(this, reservaId, claseId);
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
getAvatarUrl(alumno: any): string {
  const avatar = alumno?.avatar;

  if (avatar) {
    // Si el backend ya devuelve la ruta /uploads/avatars/... añadimos el host
    if (!avatar.startsWith('http')) {
      return `http://localhost:8000${avatar}`;
    }
    // Si ya es una URL completa (poco común pero posible)
    return avatar;
  }

  // Imagen por defecto si no hay avatar
  return 'assets/default-avatar.png';
}

  trackByClase = (_: number, c: VistaClase) => {
    return c.id;
  };
}