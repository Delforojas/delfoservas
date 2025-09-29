import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { VistasService } from '../../shared/services/vistas.service';
import { ToastService } from '../../shared/services/toast.service';

import { loadBonosPorUsuario } from '../../shared/utils/load';

import { handleHttpError } from '../../shared/utils/http-error';


@Component({
    selector: 'bonos-usuario',
    standalone: true,
    templateUrl: './bonos-usuario.html',
    imports: [CommonModule, RouterModule],
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
        private auth: AuthService,
        private toast: ToastService,
    ) { }

    ngOnInit(): void {
        this.auth.getUser().subscribe({
            next: (u) => {
                this.usuarios = u;
                this.usuarioId = Number(u?.id) || null;
                if (this.usuarioId) {
                    loadBonosPorUsuario(this);
                }
            },
            error: (e) => {
                handleHttpError(e, this.toast);
            },
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
