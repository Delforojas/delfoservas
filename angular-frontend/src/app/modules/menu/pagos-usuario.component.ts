import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { VistasService } from '../../shared/services/vistas.service';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';

import { loadWalletUsuario } from '../../shared/utils/loads/pagos-usuario.component';
import {
  UsuarioPagosState,
  createInitialUsuarioPagosState,
} from '../../shared/models/pagos-usuario.models';

@Component({
  selector: 'app-pagos-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'pagos-usuario.html',
})
export class UsuarioPagosComponent implements OnInit{
  state: UsuarioPagosState = createInitialUsuarioPagosState();

  constructor(
    public vistas: VistasService,
    public auth: AuthService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.auth.getUser().subscribe({
      next: (u) => {
        this.state.usuarios = u;
        this.state.usuarioId = Number(u?.id) || null;
        if (this.state.usuarioId) loadWalletUsuario(this);
      },
      error: (e) => handleHttpError(e, this.toast, undefined, 'cargarUsuarioError'),
    });
  }

  togglePagos(): void {
    this.state.mostrarTablaWalletUsuario = !this.state.mostrarTablaWalletUsuario;
    if (this.state.mostrarTablaWalletUsuario) {
      this.state.mostrarTablaBonosUsuario = false;
      this.state.mostrarTablaReservasUsuario = false;
    }
  }
}