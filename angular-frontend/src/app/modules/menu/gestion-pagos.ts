import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule,} from '@angular/forms';
import { FormControl } from '@angular/forms';

import { WalletService } from '../../shared/services/wallet.service';
import { VistasService } from '../../shared/services/vistas.service';
import { TipoClaseService, } from '../../shared/services/tipoclase.service';

import { RouterModule } from '@angular/router';

import { Wallet } from '../../shared/interfaces/wallet.interface';

import {
  loadUsuariosPagos,
  bindNombreUsuarioToId,
  loadTiposClase,
  loadMesesWallet,
  loadWallets,
  createWallet,
  deleteWallet,
  loadWalletAll,
  loadWalletUsuario,
  loadWalletMes,
  loadWalletTipo,
  loadWalletPorMesYTipo,
  onUsuarioSeleccionado,
  onMesSeleccionado,
  onTipoClaseSeleccionado,
  onFiltrarMesYTipo,
} from '../../shared/utils/load';


@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './gestion-pagos.html',

})
export class PagosComponent implements OnInit {
  
  usuario_id: number | null = null;
  usuarios: any[] = []; 
  nombreUsuario = new FormControl('');
  tiposClase: any[] = [];
  meses: string[] = [];          

  wallets: Wallet[] = [];
  walletAll: any[] = [];   
  walletUser: any[] = []; 
  
  tiposClaseFiltrados: any[] = [];
  tipoSeleccionadoId: number | null = null;


  walletMes: any[] = [];

  mostrarFormularioPagos = false;


  usuarioSeleccionadoId: number | null = null;
  usuarioSeleccionado: any = null;
  mostrarPagosUsuario = false;  

  

  mesSeleccionado: string | null = null;
  mostrarPagosMes = false;
  mostrarPagosClase = false;
  mostrarPagosGeneral = false;

  mostrarMesTipo = false;
  walletMesTipo: any[] = [];


  nuevaWallet: Partial<Wallet> = {
    fecha: '',
    usuario_id: 0,
    tipoclase_id: 0
  };
  cargando = false;
  error: string | null = null;

  constructor(
    private walletService: WalletService,
    private vistas: VistasService,
    private tipoClaseService: TipoClaseService  

  ) {}
ngOnInit(): void {
    loadUsuariosPagos(this);
    bindNombreUsuarioToId(this);
    loadTiposClase(this);
    loadMesesWallet(this);

    loadWalletAll(this);
    loadWallets(this);
    loadWalletPorMesYTipo(this); // si ya tienes mes/tipo seleccionados
  }


 
toggleFormularioPagos() {
  this.mostrarFormularioPagos = !this.mostrarFormularioPagos;
 
  if (!this.mostrarFormularioPagos) {
    this.nuevaWallet = { fecha: '', usuario_id: 0, tipoclase_id: 0 };
  }
}
togglePagosGeneral() {
  this.mostrarPagosGeneral = !this.mostrarPagosGeneral;
}
togglePagosUsuario() {
  this.mostrarPagosUsuario = !this.mostrarPagosUsuario;
}

togglePagosMes() {
  this.mostrarPagosMes = !this.mostrarPagosMes;
}

toggleTipoClase() {
  this.mostrarPagosClase = !this.mostrarPagosClase;
}
toggleMesyTipoClase(){
  this.mostrarMesTipo = !this.mostrarMesTipo;
}
cargarWallets(): void { loadWallets(this); }
  crearWallet(): void { createWallet(this); }
  eliminarWallet(id: number): void { deleteWallet(this, id); }

  cargarWalletAll(): void { loadWalletAll(this); }
  cargarWalletUsuario(id: number): void { loadWalletUsuario(this, id); }
  cargarWalletMes(mes: string | null): void { loadWalletMes(this, mes); }
  cargarWalletTipo(id: number): void { loadWalletTipo(this, id); }
  cargarPorMesYTipo(): void { loadWalletPorMesYTipo(this); }

  onUsuarioSeleccionado(): void { onUsuarioSeleccionado(this); }
  onMesSeleccionado(): void { onMesSeleccionado(this); }
  onTipoClaseSeleccionado(): void { onTipoClaseSeleccionado(this); }
  onFiltrarMesYTipo(): void { onFiltrarMesYTipo(this); }


}
