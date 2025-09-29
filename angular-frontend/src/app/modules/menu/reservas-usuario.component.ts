import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router';
import { VistasService } from '../../shared/services/vistas.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { ReservaUsuarioDto } from '../../shared/interfaces/reservaUsuarioDto.interface';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';
import { loadReservasUsuario, deleteReservaUsuario } from '../../shared/utils/load';


@Component({
  selector: 'app-reservas-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'reservas-usuario.html',
})
export class UsuarioReservasComponent implements OnInit {
  usuarios: any = null
  usuarioId: number | null = null;

  reservasUsuario: any[] = [];

  mostrarTablaBonosUsuario = false;
  mostrarTablaReservasUsuario = false;
  mostrarTablaWalletUsuario = false;

  eliminandoId: number | null = null

  cargando = false;
  error: string | null = null;

  constructor(
    private vistas: VistasService,
    private auth: AuthService,
    private reservationService: ReservationService,
    private toast: ToastService
  ) { }


  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: (u) => {
        this.usuarios = u;
        this.usuarioId = Number(u?.id) || null;
        if (this.usuarioId) {
          loadReservasUsuario(this);
        }
      },
      error: (e) => handleHttpError(e, this.toast, undefined, 'cargarUsuarioError'),
    });
  }

  // reemplazos 1:1
  loadReservasUsuario(): void { loadReservasUsuario(this); }

  eliminarReservaAlumno(reservaId: number): void {
    deleteReservaUsuario(this, reservaId);
  }



  toggleReservas() {
    this.mostrarTablaReservasUsuario = !this.mostrarTablaReservasUsuario;

    if (this.mostrarTablaReservasUsuario) {
      this.mostrarTablaBonosUsuario = false;
      this.mostrarTablaWalletUsuario = false;
    }
  }




  trackByReservaId = (_: number, r: ReservaUsuarioDto) => r.reserva_id;
}


