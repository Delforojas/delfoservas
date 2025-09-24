import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { RouterModule } from '@angular/router'; 
import { VistasService } from '../../shared/services/vistas.service';
import { ReservationService } from '../../shared/services/reservation.service';

import { ReservaUsuarioDto } from '../../shared/interfaces/reservaUsuarioDto.interface';


        @Component({
        selector: 'app-reservas-usuario',
        standalone: true,
        imports: [CommonModule,  RouterModule],
        templateUrl: 'reservas-usuario.html' ,
        })
        export class  UsuarioReservasComponent implements OnInit {
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
            ) {}

            ngOnInit(): void {
            this.auth.getUser().subscribe({
                next: (u) => {
                this.usuarios = u;
                this.usuarioId = Number(u?.id) || null;
                if (this.usuarioId) {
                    this.loadReservasUsuario();
                    
                }
                },
                error: (e) => console.error('Error cargando usuario', e),
            });
            }
  

            loadReservasUsuario() {
            if (!this.usuarioId || this.usuarioId <= 0) { 
                alert('Pon un usuarioId válido'); 
                return; 
            }
            this.cargando = true;
            this.vistas.getReservasPorUsuario(this.usuarioId).subscribe({
                next: d => {
                this.reservasUsuario = d ?? [];
                this.mostrarTablaReservasUsuario = true;
                this.cargando=false;
                },
                error: e => {
                this.mostrarTablaReservasUsuario = false;
                this.reservasUsuario = [];
                this.error = 'Error cargando reservas del usuario';
                console.error(e);
                this.cargando= false;
                }
            });
            }


            toggleReservas() {
            this.mostrarTablaReservasUsuario = !this.mostrarTablaReservasUsuario;

            if (this.mostrarTablaReservasUsuario) {
                this.mostrarTablaBonosUsuario = false;
                this.mostrarTablaWalletUsuario = false;
            }
            }
        
            
  eliminarReservaAlumno(reservaId: number) {
    if (reservaId == null) return;
    this.eliminandoId = reservaId;

    this.reservationService.eliminarReservation(reservaId).subscribe({
      next: () => {
        this.reservasUsuario = this.reservasUsuario.filter(r => r.reserva_id !== reservaId);
        this.eliminandoId = null;
      },
      error: (err) => {
        console.error('Error eliminando reserva', err);
        this.eliminandoId = null;
      }
    });
  }

  trackByReservaId = (_: number, r: ReservaUsuarioDto) => r.reserva_id;
}
    

