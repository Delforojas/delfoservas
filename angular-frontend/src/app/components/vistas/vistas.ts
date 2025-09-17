import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VistasService } from '../../shared/services/vistas.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-vistas',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule],
  templateUrl: './vistas.html',
})
export class VistasComponent {
  usuarioId: number | null = null;
  claseId: number | null = null;
  nombreUsuario = new FormControl('');
  usuarios: any[] = []; 
  clases: any[] = [];

  // datasets
  bonosGeneral: any[] = [];
  bonosDeUsuario: any[] = [];
  clasesUsuario: any[] = [];
  reservasUsuario: any[] = [];
  walletUsuario: any[] = [];
  bonosUsuarioVista: any[] = [];
  alumnosClase: any[] = [];
  totalAlumnosClase: any[] = [];


  cargando = false;
  mostrarTablaBonosGeneral = false;
  mostrarTablaBonosUsuario = false;
  mostrarTablaClasesUsuario = false;
  mostrarTablaReservasUsuario = false;
  mostrarTablaWalletUsuario = false;
  mostrarTablaBonosVistaUsuario = false;
  mostrarTablaAlumnosClase = false;
  mostrarTablaTotalAlumnosClase = false;
  error: string | null = null;

  constructor(private vistas: VistasService) {}

  ngOnInit(): void {
  // Cargar la lista de usuarios
  this.vistas.getUsuarios().subscribe({
    next: (u) => { 
      this.usuarios = u ?? []; 
      console.log('Usuarios cargados', this.usuarios);
    },
    error: (err) => console.error('Error cargando usuarios', err)
  });

  // Vincular nombreUsuario con usuarioId
  this.nombreUsuario.valueChanges.subscribe(nombre => {
    const usuario = this.usuarios.find(u => u.nombre === nombre);
    this.usuarioId = usuario ? usuario.id : null;
    console.log('Usuario seleccionado:', nombre, '→ ID:', this.usuarioId);
  });
  
  // Cargar clases
  this.vistas.getClases().subscribe({
    next: (c) => { this.clases = c ?? []; },
    error: (err) => console.error('Error cargando clases', err)
  });
    this.resetTablas();

  
}

  private start() { this.cargando = true; this.error = null; }
  private done() { this.cargando = false; }



loadBonosGeneral() {
  if (this.bonosGeneral.length === 0) {
    // Cargar solo si no hay datos
    this.start();
    this.vistas.getBonos().subscribe({
      next: d => {
        this.bonosGeneral = d ?? [];
        this.mostrarTablaBonosGeneral = true;
        this.done();
      },
      error: e => {
        this.error = 'Error cargando vista de bonos';
        console.error(e);
        this.done();
      }
    });
  } else {
    // Solo cambiar visibilidad
    this.mostrarTablaBonosGeneral = !this.mostrarTablaBonosGeneral;
  }
}


loadBonosPorUsuario() {
  if (!this.usuarioId || this.usuarioId <= 0) { 
    alert('Pon un usuarioId válido'); 
    return; 
  }

  // Si ya está visible, lo ocultamos y salimos
  if (this.mostrarTablaBonosUsuario) {
    this.mostrarTablaBonosUsuario = false;
    return;
  }

  this.start();
  this.vistas.getBonosPorUsuario(this.usuarioId).subscribe({
    next: d => { 
      this.bonosDeUsuario = d; 
      this.mostrarTablaBonosUsuario = true;
      this.done(); 
    },
    error: e => { 
      this.error = 'Error cargando bonos del usuario'; 
      console.error(e); 
      this.done(); 
    }
  });
}


loadClasesUsuario() {
  if (!this.usuarioId || this.usuarioId <= 0) { 
    alert('Pon un usuarioId válido'); 
    return; 
  }

  if (this.mostrarTablaClasesUsuario) {
    this.mostrarTablaClasesUsuario = false;
    return;
  }

  this.start();
  this.vistas.getClasesPorUsuario(this.usuarioId).subscribe({
    next: d => { 
      this.clasesUsuario = d; 
      this.mostrarTablaClasesUsuario = true;
      this.done(); 
    },
    error: e => { 
      this.error = 'Error cargando clases del usuario'; 
      console.error(e); 
      this.done(); 
    }
  });
}

loadReservasUsuario() {
  if (!this.usuarioId || this.usuarioId <= 0) { 
    alert('Pon un usuarioId válido'); 
    return; 
  }

  // Toggle: si ya está visible, ocultar y limpiar
  if (this.mostrarTablaReservasUsuario) {
    this.mostrarTablaReservasUsuario = false;
    this.reservasUsuario = [];
    return;
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
  if (this.mostrarTablaWalletUsuario) {
    this.mostrarTablaWalletUsuario = false;
    this.walletUsuario = [];
    return;
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

 

loadBonosVistaUsuario() {
  if (!this.usuarioId || this.usuarioId <= 0) {
    alert('Pon un usuarioId válido');
    return;
  }

  // Toggle
  if (this.mostrarTablaBonosVistaUsuario) {
    this.mostrarTablaBonosVistaUsuario = false;
    this.bonosUsuarioVista = [];
    return;
  }

  this.start();
  this.vistas.getBonosVistaPorUsuario(this.usuarioId).subscribe({
    next: d => {
      this.bonosUsuarioVista = d ?? [];
      this.mostrarTablaBonosVistaUsuario = true;
      this.done();
    },
    error: e => {
      this.mostrarTablaBonosVistaUsuario = false;
      this.bonosUsuarioVista = [];
      this.error = 'Error cargando bonos (vista) del usuario';
      console.error(e);
      this.done();
    }
  });
}

loadAlumnosClase() {
  if (!this.claseId || this.claseId <= 0) { 
    alert('Pon un claseId válido'); 
    return; 
  }

  // Toggle: si ya está visible, ocultamos y limpiamos
  if (this.mostrarTablaAlumnosClase) {
    this.mostrarTablaAlumnosClase = false;
    this.alumnosClase = [];        // 👈 importante para que el HTML no lo muestre por length
    return;
  }

  this.start();
  this.vistas.getAlumnosPorClase(this.claseId).subscribe({
    next: (d) => {
      this.alumnosClase = Array.isArray(d) ? d : (d ? [d] : []);
      this.mostrarTablaAlumnosClase = true;
      this.done();
    },
    error: (e) => {
      this.error = 'Error cargando alumnos de la clase';
      console.error(e);
      this.mostrarTablaAlumnosClase = false;
      this.alumnosClase = [];
      this.done();
    }
  });
}


  loadTotalAlumnosClase() {
  if (!this.claseId || this.claseId <= 0) { alert('Pon un claseId válido'); return; }

  // toggle: si ya estaba visible, ocultamos y salimos
  if (this.mostrarTablaTotalAlumnosClase) {
    this.mostrarTablaTotalAlumnosClase = false;
    return;
  }

  this.start();
  this.vistas.getTotalAlumnosPorClase(this.claseId).subscribe({
    next: (d) => {
      this.totalAlumnosClase = Array.isArray(d) ? d : (d ? [d] : [])           // oculta otras tablas de clase
      this.mostrarTablaTotalAlumnosClase = true;
      this.done();
    },
    error: (e) => {
      this.error = 'Error cargando total de alumnos de la clase';
      console.error(e);
      this.mostrarTablaTotalAlumnosClase = false;
      this.done();
    }
  });
}

  // util para limpiar resultados (opcional)
  clearAll() {
    this.bonosGeneral = [];
    this.bonosDeUsuario = [];
    this.clasesUsuario = [];
    this.reservasUsuario = [];
    this.walletUsuario = [];
    this.bonosUsuarioVista = [];
    this.alumnosClase = [];
    this.totalAlumnosClase = [];
    this.error = null;
  }
resetTablas() {
  this.mostrarTablaBonosUsuario = false;
  this.mostrarTablaClasesUsuario = false;
  this.mostrarTablaReservasUsuario = false;
  this.mostrarTablaWalletUsuario = false;
  this.mostrarTablaBonosVistaUsuario = false;
}

}