import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule,} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { WalletService, Wallet } from '../../shared/services/wallet.service';
import { VistasService } from '../../shared/services/vistas.service';
import { TipoClaseService, } from '../../shared/services/tipoclase.service';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule , RouterModule],
  templateUrl: './gestion-pagos.html',
  styleUrls: ['./wallet.css']
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
    this.vistas.getUsuarios().subscribe({
    next: (u) => { 
      this.usuarios = u ?? []; 
      
      console.log('Usuarios cargados', this.usuarios);
    },
    error: (err) => console.error('Error cargando usuarios', err)
  });

    this.nombreUsuario.valueChanges.subscribe(nombre => {
      const usuario = this.usuarios.find(u => u.nombre === nombre);
      this.usuario_id = usuario ? usuario.id : null;
      console.log('Usuario seleccionado:', nombre, '→ ID:', this.usuario_id);
    });
    this.tipoClaseService.getTipos().subscribe({
      next: (t) => this.tiposClase = t ?? [],
      error: (e) => console.error('Error cargando tipos de clase', e)
    });

    this.vistas.getMesesWallet().subscribe({
    next: (m) => {
      this.meses = m ?? [];
      console.log('Meses cargados:', this.meses);

      const mesesEs = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      const mesActual = mesesEs[new Date().getMonth()];
      this.mesSeleccionado = this.meses.find(x => x.toLowerCase() === mesActual.toLowerCase()) ?? null;

      if (this.mesSeleccionado) {
        this.cargarWalletMes(this.mesSeleccionado);
      }
    },
    error: (e) => console.error('Error cargando meses', e)
  });
  if (!this.mesSeleccionado || !this.tipoSeleccionadoId) {
    this.walletMesTipo = [];
    return;
  }

  this.vistas.getWalletPorMesYTipo(this.mesSeleccionado, this.tipoSeleccionadoId).subscribe({
    next: (d) => {
      this.walletMesTipo = d ?? [];
      console.log('Resultados mes + tipo:', this.walletMesTipo);
    },
    error: (e) => console.error('Error al cargar wallets por mes y tipo', e)
  });

  // 5) Wallets generales
  this.cargarWalletAll();
  this.cargarWallets();
  this.cargarPorMesYTipo();

}

  cargarWallets(): void {
    this.cargando = true;
    this.walletService.getWallets().subscribe({
      next: (data) => {
        this.wallets = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar las wallets';
        this.cargando = false;
      }
    });
  }

  crearWallet(): void {
    if (!this.nuevaWallet.fecha || !this.nuevaWallet.usuario_id || !this.nuevaWallet.tipoclase_id) {
      alert('Completa todos los campos');
      return;
    }

    this.walletService.crearWallet(this.nuevaWallet as any).subscribe({
      next: () => {
        this.nuevaWallet = { fecha: '', usuario_id: 0, tipoclase_id: 0 };
        this.cargarWallets();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear la wallet';
      }
    });
  }

  eliminarWallet(id: number): void {
    if (confirm('¿Seguro que quieres eliminar esta wallet?')) {
      this.walletService.eliminarWallet(id).subscribe({
        next: () => this.cargarWalletAll(),
        error: (err) => {
          console.error(err);
          this.error = 'Error al eliminar wallet';
        }
      });
    }
  }


  cargarWalletAll() {
  this.vistas.getVistaUsuarioWalletAll().subscribe({
    next: d => this.walletAll = d,
    error: e => console.error(e)
  });
}

  cargarWalletUsuario(id: number) {
    this.vistas.getVistaUsuarioWalletByUser(id).subscribe({
      next: d => this.walletUser = d,
      error: e => console.error(e)
    });
  }
  cargarWalletMes(mes: string | null) {
    if (!mes) { this.walletMes = []; return; }
    this.vistas.getWalletMes(mes).subscribe({
      next: d => this.walletMes = d ?? [],
      error: e => console.error('Error al cargar wallets por mes', e)
    });
  }
  cargarWalletTipo(id: number) {
  this.vistas.getWalletPorTipoClase(id).subscribe({
    next: d => {
      this.tiposClaseFiltrados = d ?? [];
      console.log('Pagos filtrados desde backend:', this.tiposClaseFiltrados);
    },
    error: e => console.error('Error al cargar wallets por tipo de clase', e)
  });
}
cargarPorMesYTipo(): void {
  console.log('Mes enviado al backend:', this.mesSeleccionado);
  console.log('Tipo enviado al backend:', this.tipoSeleccionadoId);
  
  if (!this.mesSeleccionado || !this.tipoSeleccionadoId) { 
    this.walletMesTipo = []; 
    return; 
  }

  this.vistas.getWalletPorMesYTipo(this.mesSeleccionado, this.tipoSeleccionadoId).subscribe({
    next: d => {
      this.walletMesTipo = d ?? [];
      console.log('Respuesta backend:', this.walletMesTipo);
    },
    error: e => console.error(e)
  });
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
onUsuarioSeleccionado() {
  if (this.usuarioSeleccionadoId) {
    this.usuarioSeleccionado =
      this.usuarios.find(u => u.id === this.usuarioSeleccionadoId) ?? null;

    this.cargarWalletUsuario(this.usuarioSeleccionadoId);
  } else {
    this.walletUser = [];
    this.usuarioSeleccionado = null;
  }
}
onMesSeleccionado() {
  if (this.mesSeleccionado) {
    this.walletMes = this.walletAll.filter(wm => wm.mes === this.mesSeleccionado);
  } else {
    this.walletMes = [];
  }
}
onTipoClaseSeleccionado() {
  if (this.tipoSeleccionadoId) {
    this.cargarWalletTipo(this.tipoSeleccionadoId);
  } else {
    this.tiposClaseFiltrados = [];
  }
}
onFiltrarMesYTipo() {
  if (this.mesSeleccionado && this.tipoSeleccionadoId) {
    this.vistas.getWalletPorMesYTipo(this.mesSeleccionado, this.tipoSeleccionadoId).subscribe({
      next: (data) => {
        this.walletMesTipo = data ?? [];
        this.mostrarMesTipo = true;  // 👈 se muestran los resultados
        console.log('Resultados mes + tipo:', this.walletMesTipo);
      },
      error: (err) => console.error('Error al filtrar por mes y tipo', err)
    });
  }
}
}
