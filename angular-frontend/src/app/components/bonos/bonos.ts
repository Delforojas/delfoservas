import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BonosService, Bono } from '../../shared/services/bonos.service';
import { RouterModule } from '@angular/router';


type BonoCreate = Omit<Bono, 'id'>;

@Component({
  selector: 'app-bonos',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterModule],
  templateUrl: './bonos.html',
  styleUrls: ['./bonos.component.css']
})
export class BonosComponent implements OnInit {
  bonos: Bono[] = [];
  cargando = false;
  error: string | null = null;

  // formulario de creación
  nuevo: BonoCreate = {
    clases_restantes: 0,
    clases_totales: 0,
    fecha: '',
    estado: 'activo',
    tipoclase_id: 0,
    wallet_id: 0
  };

  // edición inline
  editando: Bono | null = null;

  constructor(private bonosService: BonosService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = null;
    this.bonosService.getBonos().subscribe({
      next: (list) => { this.bonos = list; this.cargando = false; },
      error: (e) => { this.error = 'Error al cargar bonos'; this.cargando = false; console.error(e); }
    });
  }

  // --- helpers de normalización ---
  private normalizeCreate(data: BonoCreate): BonoCreate {
    return {
      ...data,
      clases_restantes: Number(data.clases_restantes),
      clases_totales: Number(data.clases_totales),
      tipoclase_id: Number(data.tipoclase_id),
      wallet_id: Number(data.wallet_id),
      fecha: (data.fecha ?? '').slice(0, 10),
      estado: (data.estado ?? 'activo')
    };
  }

  private validateCreate(data: BonoCreate): string[] {
    const errs: string[] = [];
    if (!data.fecha) errs.push('fecha');
    if (!data.estado?.trim()) errs.push('estado');
    if (!(Number(data.tipoclase_id) > 0)) errs.push('tipoclase_id');
    if (!(Number(data.wallet_id) > 0)) errs.push('wallet_id');
    if (!(Number(data.clases_totales) > 0)) errs.push('clases_totales');
    if (!(Number(data.clases_restantes) >= 0)) errs.push('clases_restantes');
    if (Number(data.clases_restantes) > Number(data.clases_totales)) errs.push('clases_restantes>totales');
    return errs;
  }

  crear(): void {
    const payload = this.normalizeCreate(this.nuevo);
    const errores = this.validateCreate(payload);
    if (errores.length) {
      alert('Completa correctamente: ' + errores.join(', '));
      return;
    }

    this.bonosService.crearBono(payload).subscribe({
      next: () => {
        this.nuevo = { clases_restantes: 0, clases_totales: 0, fecha: '', estado: 'activo', tipoclase_id: 0, wallet_id: 0 };
        this.cargar();
      },
      error: (e) => { this.error = 'Error al crear bono'; console.error(e); }
    });
  }

  empezarEdicion(b: Bono): void {
    // clonado para no tocar la fila hasta guardar
    this.editando = { ...b };
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const id = this.editando.id;
    const data = { ...this.editando } as Partial<Bono>;

    // normaliza campos numéricos/fecha
    if (data.clases_restantes != null) data.clases_restantes = Number(data.clases_restantes);
    if (data.clases_totales   != null) data.clases_totales   = Number(data.clases_totales);
    if (data.tipoclase_id     != null) data.tipoclase_id     = Number(data.tipoclase_id);
    if (data.wallet_id        != null) data.wallet_id        = Number(data.wallet_id);
    if (data.fecha            != null) data.fecha            = String(data.fecha).slice(0, 10);

    this.bonosService.actualizarBono(id, data).subscribe({
      next: () => { this.editando = null; this.cargar(); },
      error: (e) => { this.error = 'Error al actualizar bono'; console.error(e); }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este bono?')) return;
    this.bonosService.eliminarBono(id).subscribe({
      next: () => this.cargar(),
      error: (e) => { this.error = 'Error al eliminar bono'; console.error(e); }
    });
  }
}