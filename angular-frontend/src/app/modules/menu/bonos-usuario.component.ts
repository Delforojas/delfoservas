import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { VistasService } from '../../shared/services/vistas.service';


@Component({
  selector: 'bonos-usuario',
  standalone: true,
  templateUrl: './bonos-usuario.html',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], 
})
export class UsuarioBonosComponent implements OnInit {
        usuarios: any = null
        usuarioId: number | null = null;
        
        bonosDeUsuario: any[] = [];
        
        mostrarTablaBonosUsuario = false; 
        mostrarTablaReservasUsuario = false;
        mostrarTablaWalletUsuario = false;

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
                this.usuarioId = Number(u?.id) || null;
                // 🔥 carga automática al entrar por ruta
                if (this.usuarioId) {
                    this.loadBonosPorUsuario();
                }
                },
                error: (e) => console.error('Error cargando usuario', e),
            });
            }
  
            loadBonosPorUsuario(): void {

            const id = Number(this.usuarioId);
            if (!id || id <= 0) {
                alert('Pon un usuarioId válido');
                return;
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
            toggleBonos() {
            this.mostrarTablaBonosUsuario = !this.mostrarTablaBonosUsuario;

            if (this.mostrarTablaBonosUsuario) {
                this.mostrarTablaWalletUsuario = false;
                this.mostrarTablaReservasUsuario = false;
            }
        }
      
    }
