// src/app/components/users/users.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// ⬇️ USA **UNA** de estas rutas según tu proyecto:
// Si el servicio está en src/app/services/users.service.ts:
import { UsersService, Usuario } from '../../shared/services/users.service';
// Si lo tienes en src/app/shared/services/users.service.ts, usa esta en su lugar:
// import { UsersService, Usuario } from '../../shared/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
})
export class UsersComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioSeleccionado: Usuario | null = null;

  // para el template
  cargando = false;
  error = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = '';
    this.usersService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar usuarios';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  // coincide con tu HTML (verUsuario)
  verUsuario(id: number): void {
    this.error = '';
    this.usersService.getUsuario(id).subscribe({
      next: (data: Usuario) => {
        this.usuarioSeleccionado = data;
      },
      error: (err: any) => {
        this.error = 'Error al obtener usuario';
        console.error(err);
      }
    });
  }

  actualizarUsuario(id: number, cambios: Partial<Usuario>): void {
    this.error = '';
    this.usersService.actualizarUsuario(id, cambios).subscribe({
      next: () => {
        alert('Usuario actualizado');
        this.cargarUsuarios();
      },
      error: (err: any) => {
        this.error = 'Error al actualizar usuario';
        console.error(err);
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;
    this.error = '';
    this.usersService.eliminarUsuario(id).subscribe({
      next: () => {
        alert('Usuario eliminado');
        this.cargarUsuarios();
      },
      error: (err: any) => {
        this.error = 'Error al eliminar usuario';
        console.error(err);
      }
    });
  }
}