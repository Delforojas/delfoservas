import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

import { ClaseService, Clase, VistaClase } from '../../shared/services/clases.service';
import { VistasService } from '../../shared/services/vistas.service';

type Usuario = { id: number; nombre: string };

@Component({
  selector: 'app-menu3',
  standalone: true,
  templateUrl: './menu3.html', 
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule], // 👈 añade ReactiveFormsModule
})
export class MenuComponent3 implements OnInit {
clases: Clase[] = [];                 // /api/clases  (IDs)
clasesVista: VistaClase[] = [];  
   
  nuevaClase: Omit<Clase, 'id'> = {
    nombre: '',
    tipoclase: 0,
    teacher: 0,
    fecha: '',
    hora: '',
    aforo_clase: 0,
    room: 0
  };
  usuarios: any = null
  usuarioId: number | null = null;
  nombreUsuario = new FormControl<string>('', { nonNullable: true });
  claseId: number | null = null;
  

  mostrarFormularioCrearClase=false;
  mostrarTablaClases=false;
  mostrarTablaAlumnosClase = false;
  mostrarTablaTotalAlumnosClase = false;
  alumnosClase: any[] = [];
  totalAlumnosClase: any[] = [];
  mostrarSelectClase = false;  


  cargando = false;
  error: string | null = null;

  constructor(
    private claseService: ClaseService,
    private vistas: VistasService,
    private auth: AuthService

  ) {}
 private start() {
  this.cargando = true;
  this.error = null;
}

private done() {
  this.cargando = false;
}
  ngOnInit(): void {
    this.auth.getUser().subscribe({
      next: (u) => {
        this.usuarios = u;
        this.usuarioId = Number(u?.id) || null; // ajusta si tu API usa otro nombre
        this.cargarClases();
      },
      error: (e) => console.error('Error cargando usuario', e),
      
    });

    // (si ya no usas el select, puedes borrar todo lo de this.usuarios y nombreUsuario)
  }
  
   cargarClases(): void {
    this.cargando = true;
    this.claseService.getClases().subscribe({
      next: (data) => {
        this.clases = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar clases';
        this.cargando = false;
      }
    });
  }
  crearClase(): void {
  const c = this.nuevaClase;

  // 1) Normaliza tipos (los select/input suelen traer strings)
  const payload = {
    ...c,
    tipoclase: Number(c.tipoclase),
    teacher: Number(c.teacher),
    aforo_clase: Number(c.aforo_clase),
    room: Number(c.room),
    nombre: (c.nombre ?? '').trim(),
    fecha: (c.fecha ?? '').trim(), // esperado YYYY-MM-DD
    hora: (c.hora ?? '').trim(),   // esperado HH:mm
  };

  // 2) Valida campo a campo y di cuál falla
  const errores: string[] = [];
  if (!payload.nombre) errores.push('nombre');
  if (!payload.fecha) errores.push('fecha');
  if (!payload.hora) errores.push('hora');
  if (!Number.isFinite(payload.tipoclase) || payload.tipoclase <= 0) errores.push('tipoclase');
  if (!Number.isFinite(payload.teacher)   || payload.teacher   <= 0) errores.push('teacher');
  if (!Number.isFinite(payload.aforo_clase) || payload.aforo_clase <= 0) errores.push('aforo_clase');
  if (!Number.isFinite(payload.room) || payload.room <= 0) errores.push('room');

  if (errores.length) {
    alert('Completa correctamente: ' + errores.join(', '));
    console.warn('Valores recibidos en nuevaClase:', this.nuevaClase);
    console.warn('Payload normalizado:', payload);
    return;
  }

  // 3) Enviar
  this.claseService.crearClase(payload).subscribe({
    next: () => {
      this.nuevaClase = { nombre: '', tipoclase: 0, teacher: 0, fecha: '', hora: '', aforo_clase: 0, room: 0 };
      this.cargarClases();
    },
    error: (err) => {
      this.error = 'Error al crear la clase';
      console.error(err);
    }
  });
}
eliminarClase(id: number): void {
    if (confirm('¿Eliminar esta clase?')) {
      this.claseService.eliminarClase(id).subscribe({
        next: () => this.cargarClases(),
        error: (err) => {
          this.error = 'Error al eliminar la clase';
          console.error(err);
        }
      });
    }
  }
loadAlumnosClase() {
 if (!this.mostrarSelectClase) {
    this.mostrarSelectClase = true;
    return;
  }
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
    if (!this.mostrarSelectClase) {
    this.mostrarSelectClase = true;
    return;
  }
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

  logout(): void {
    this.auth.
    logout();
  }
}