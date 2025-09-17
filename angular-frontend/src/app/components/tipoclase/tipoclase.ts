import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TipoClaseService, TipoClase } from '../../shared/services/tipoclase.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-tipoclase',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule , RouterModule],
  templateUrl: './tipoclase.html',
  styleUrls: ['./tipoclase.component.css']
})
export class TipoclaseComponent implements OnInit {
  tipos: TipoClase[] = [];
  nuevoNombre: string = '';
  nuevasClasesTotales: number = 0;
  cargando = false;
  error: string | null = null;
  tipoSeleccionado: TipoClase | null = null;

  constructor(private tipoClaseService: TipoClaseService) {}

 ngOnInit(): void {
  this.tipoClaseService.getTipos().subscribe({
    next: (data) => this.tipos = data,
    error: (err) => console.error('Error cargando tipos:', err)
  });
}
  cargarTipos(): void {
    this.cargando = true;
    this.tipoClaseService.getTipos().subscribe({
      next: (data) => {
        this.tipos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar los tipos de clase';
        this.cargando = false;
      }
    });
  }

  crearTipo(): void {
    if (!this.nuevoNombre || this.nuevasClasesTotales <= 0) return;
    const nuevo = {
      nombre: this.nuevoNombre,
      clases_totales: this.nuevasClasesTotales
    };

    this.tipoClaseService.crearTipo(nuevo).subscribe({
      next: () => {
        this.nuevoNombre = '';
        this.nuevasClasesTotales = 0;
        this.cargarTipos();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear tipo de clase';
      }
    });
  }

  eliminarTipo(id: number): void {
    if (confirm('¿Seguro que quieres eliminar este tipo de clase?')) {
      this.tipoClaseService.eliminarTipo(id).subscribe({
        next: () => this.cargarTipos(),
        error: (err) => {
          console.error(err);
          this.error = 'Error al eliminar tipo de clase';
        }
      });
    }
  }
}