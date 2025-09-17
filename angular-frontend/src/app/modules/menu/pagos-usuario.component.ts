import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router'; 
import { VistasService } from '../../shared/services/vistas.service';


    @Component({
    selector: 'app-pagos-usuario',
    standalone: true,
    imports: [CommonModule,  RouterModule],
    templateUrl: 'pagos-usuario.html' ,
    })

    export class UsuarioPagosComponent implements OnInit {
            usuarios: any = null
            usuarioId: number | null = null;
            
            walletUsuario: any [] = [];

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
                        this.loadWalletUsuario()
                    }
                    },
                    error: (e) => console.error('Error cargando usuario', e),
                });
                }
                
                loadWalletUsuario() {
                if (!this.usuarioId || this.usuarioId <= 0) {
                    alert('Pon un usuarioId válido');
                    return;
                }

                // Toggle
                
                this.cargando= true;
                this.vistas.getWalletPorUsuario(this.usuarioId).subscribe({
                    next: d => {
                    this.walletUsuario = d ?? [];
                    this.mostrarTablaWalletUsuario = true;
                    this.cargando= false;
                    },
                    error: e => {
                    this.mostrarTablaWalletUsuario = false;
                    this.walletUsuario = [];
                    this.error = 'Error cargando wallet del usuario';
                    console.error(e);
                    this.cargando= false;
                    }
                });
                }
                togglePagos(){
                    this.mostrarTablaWalletUsuario =!this.mostrarTablaWalletUsuario;
                if (this.mostrarTablaWalletUsuario) {
                    this.mostrarTablaBonosUsuario = false;
                    this.mostrarTablaReservasUsuario = false;
                }

            }

        }