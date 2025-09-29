import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router'; 
import { VistasService } from '../../shared/services/vistas.service';
import { ToastService } from '../../shared/services/toast.service';
import { handleHttpError } from '../../shared/utils/http-error';


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
                    private auth: AuthService,
                    private toast :ToastService
                ) {}

                ngOnInit(): void {
                this.auth.getUser().subscribe({
                    next: (u) => {
                    this.usuarios = u;
                    this.usuarioId = Number(u?.id) || null;
                    if (this.usuarioId) {
                        this.loadWalletUsuario()
                    }
                    },
                   error: (e) => handleHttpError(e, this.toast, undefined, 'cargarUsuarioError'),
                });
                }
                
                loadWalletUsuario() {
                if (!this.usuarioId || this.usuarioId <= 0) {
                    handleHttpError({ status: 400 } as any, this.toast, undefined, 'walletError');
                return;
                }

                
                this.cargando= true;
                this.vistas.getWalletPorUsuario(this.usuarioId).subscribe({
                    next: d => {
                    this.walletUsuario = d ?? [];
                    this.mostrarTablaWalletUsuario = true;
                    this.cargando= false;
                    },
                    error: (e) => {
                    this.mostrarTablaWalletUsuario = false;
                    this.walletUsuario = [];
                    handleHttpError(e, this.toast, undefined, 'walletError');
                    },
                    
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
