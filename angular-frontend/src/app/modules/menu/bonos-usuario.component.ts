import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { VistasService } from '../../shared/services/vistas.service';
import { ToastService } from '../../shared/services/toast.service';

import { loadBonosPorUsuario } from '../../shared/utils/load';

import { handleHttpError } from '../../shared/utils/http-error';


import {
  UsuarioBonosState,
  createInitialUsuarioBonosState,
} from '../../shared/models/bonos.models';
import { UsuarioBonosContext } from '../../shared/utils/interfaces';


@Component({
    selector: 'bonos-usuario',
    standalone: true,
    templateUrl: './bonos-usuario.html',
    imports: [CommonModule, RouterModule],
})
export class UsuarioBonosComponent implements OnInit, UsuarioBonosContext {
  state: UsuarioBonosState = createInitialUsuarioBonosState();

  constructor(
    public vistas: VistasService,
    public auth: AuthService,
    public toast: ToastService
  ) {}
    

    ngOnInit(): void {
  const token = localStorage.getItem('token');
  if (!token) return; // sin token no pidas /me ni bonos

  this.auth.getUser().subscribe({
    next: (u) => {
      this.state.usuarios = u;
      this.state.usuarioId = Number(u?.id) || null;
      if (this.state.usuarioId) {
        loadBonosPorUsuario(this); // <- esta versión debe usar ctx.state.*
      }
    },
    error: (e) => handleHttpError(e, this.toast),
  });
}

  toggleBonos() {
    this.state.mostrarTablaBonosUsuario = !this.state.mostrarTablaBonosUsuario;

    if (this.state.mostrarTablaBonosUsuario) {
      this.state.mostrarTablaWalletUsuario = false;
      this.state.mostrarTablaReservasUsuario = false;
    }
  }
}