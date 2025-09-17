import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { VistasService } from '../../shared/services/vistas.service';

type Usuario = { id: number; nombre: string };

@Component({
  selector: 'app-menu2',
  standalone: true,
  templateUrl: './menu2.html',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], // 👈 añade ReactiveFormsModule
})
export class MenuComponent2 implements OnInit {
  usuarios: any = null
  usuarioId: number | null = null;
  nombreUsuario = new FormControl<string>('', { nonNullable: true });
  bonosDeUsuario: any[] = [];
  reservasUsuario: any[] = [];
  walletUsuario: any [] = [];

  mostrarTablaBonosUsuario = false; 
  mostrarTablaReservasUsuario = false;
  mostrarTablaWalletUsuario = false;

  mostrarAside = false;
  cargando = false;
  error: string | null = null;

  constructor(
    private vistas: VistasService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: (u) => {
        this.usuarios = u;
        this.usuarioId = Number(u?.id) || null; // ajusta si tu API usa otro nombre
      },
      error: (e) => console.error('Error cargando usuario', e),
    });

    // (si ya no usas el select, puedes borrar todo lo de this.usuarios y nombreUsuario)
  }
  

  private start() { this.cargando = true; this.error = null; }
  private done() { this.cargando = false; }

 loadBonosPorUsuario(): void {

  const id = Number(this.usuarioId);
  if (!id || id <= 0) {
    alert('Pon un usuarioId válido');
    return;
  }
  this.mostrarTablaBonosUsuario =!this.mostrarTablaBonosUsuario;
  if (this.mostrarTablaBonosUsuario) {
    this.mostrarTablaWalletUsuario = false;
    this.mostrarTablaReservasUsuario = false;
  }
  this.cargando = true; 
  this.error = null;

  this.vistas.getBonosPorUsuario(id).subscribe({
    next: (d) => {

      this.bonosDeUsuario = d ?? [];
      this.mostrarTablaBonosUsuario = true;
      this.cargando = false;
    },
    error: (e) => {
      console.error('[Menu2] bonos ERROR', e);
      this.error = 'Error cargando bonos del usuario';
      this.cargando = false;
    }
  });
}
loadReservasUsuario() {
  if (!this.usuarioId || this.usuarioId <= 0) { 
    alert('Pon un usuarioId válido'); 
    return; 
  }

  // Toggle: si ya está visible, ocultar y limpiar
  this.mostrarTablaReservasUsuario =!this.mostrarTablaReservasUsuario;
  if (this.mostrarTablaReservasUsuario) {
    this.mostrarTablaBonosUsuario = false;
    this.mostrarTablaWalletUsuario = false;
  }

  this.start();
  this.vistas.getReservasPorUsuario(this.usuarioId).subscribe({
    next: d => {
      this.reservasUsuario = d ?? [];
      this.mostrarTablaReservasUsuario = true;
      this.done();
    },
    error: e => {
      this.mostrarTablaReservasUsuario = false;
      this.reservasUsuario = [];
      this.error = 'Error cargando reservas del usuario';
      console.error(e);
      this.done();
    }
  });
}
loadWalletUsuario() {
  if (!this.usuarioId || this.usuarioId <= 0) {
    alert('Pon un usuarioId válido');
    return;
  }

  // Toggle
  this.mostrarTablaWalletUsuario =!this.mostrarTablaWalletUsuario;
  if (this.mostrarTablaWalletUsuario) {
    this.mostrarTablaBonosUsuario = false;
    this.mostrarTablaReservasUsuario = false;
  }

  this.start();
  this.vistas.getWalletPorUsuario(this.usuarioId).subscribe({
    next: d => {
      this.walletUsuario = d ?? [];
      this.mostrarTablaWalletUsuario = true;
      this.done();
    },
    error: e => {
      this.mostrarTablaWalletUsuario = false;
      this.walletUsuario = [];
      this.error = 'Error cargando wallet del usuario';
      console.error(e);
      this.done();
    }
  });
}

toggleAside() {
  this.mostrarAside = !this.mostrarAside;
}
  logout(): void {
    this.auth.logout();
  }
}