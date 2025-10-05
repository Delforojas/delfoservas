import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { VistasService } from '../../shared/services/vistas.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';

import { loadReservasUsuario, deleteReservaUsuario } from '../../shared/utils/load';

import {
  UsuarioReservasState,
  createInitialUsuarioReservasState,
} from '../../shared/models/reservas-usuario.models';
import { UsuarioReservasContext } from '../../shared/utils/interfaces';
import { ReservaUsuarioDto } from '../../shared/interfaces/reservaUsuarioDto.interface';

@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'reservas-usuario.html',
})
export class UsuarioReservasComponent implements OnInit, UsuarioReservasContext {
  state: UsuarioReservasState = createInitialUsuarioReservasState();

  constructor(
    public vistas: VistasService,
    public auth: AuthService,
    public reservationService: ReservationService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.auth.getUser().subscribe({
      next: (u) => {
        this.state.usuarios = u;
        this.state.usuarioId = Number(u?.id) || null;
        if (this.state.usuarioId) loadReservasUsuario(this);
      },
      error: (e) => handleHttpError(e, this.toast, undefined, 'cargarUsuarioError'),
    });
  }

  // acciones UI
  toggleReservas() {
    this.state.mostrarTablaReservasUsuario = !this.state.mostrarTablaReservasUsuario;
    if (this.state.mostrarTablaReservasUsuario) {
      this.state.mostrarTablaBonosUsuario = false;
      this.state.mostrarTablaWalletUsuario = false;
    }
  }

  eliminarReservaAlumno(reservaId: number): void {
    deleteReservaUsuario(this, reservaId);
  }

  trackByReservaId = (_: number, r: ReservaUsuarioDto) => r.reserva_id;
}