import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ClaseService} from '../../shared/services/clases.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';
import { Clase } from '../../shared/interfaces/clase.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ClaseProfe } from '../../shared/interfaces/claseProfe.interface';
import { Alumno } from '../../shared/interfaces/Alumno.interface'


import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-clases-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule , RouterModule],
  templateUrl: './clases-profesor.html',
 
})
export class ClasesProfesorComponent implements OnInit 
      {

          clasesVista: VistaClase[] = [];
          clases: Clase[] = [];

          cargando = false;
          error: string | null = null;

          claseSeleccionadaId: number | null = null;

          clasesprofe: ClaseProfe[] = [];
          alumnos: Alumno[] = []; 
          
          cargandoAlumnos = false;
          errorAlumnos: string | null = null;


          mostrarTabla = false;
          mostrarTablaProfesores = false;
          mostrarTablaAlumnos = false;
          

          eliminandoId: number | null = null;


          constructor(
            private claseService: ClaseService,
            private reservationService: ReservationService,
            public auth: AuthService
            ) {}

          ngOnInit(): void {
            this.cargarClases();
            this.cargarClasesVista(); 
            this.cargarClasesProfesores();
        }

          cargarClases(): void {
            this.claseService.getClases().subscribe({ 
              next: (data: Clase[]) => this.clases = data,
              error: () => this.error = 'Error al cargar clases'
            });
          }
          cargarClasesVista(): void {
            this.claseService.getClasesVista().subscribe({ 
              next: (data: VistaClase[]) => this.clasesVista = data,
              error: () => this.error = 'Error al cargar vista de clases'
            });
          }

        cargarClasesProfesores(): void {
            this.cargando = true;
            this.error = null;
            this.claseService.getMisClases().subscribe({
              next: (rows) => { this.clasesprofe = rows; this.cargando = false; },
              error: (e) => { this.error = 'No se pudieron cargar tus clases'; this.cargando = false; }
            });
          }

        cargarAlumnos(id: number): void {
          console.log('Entrando a cargarAlumnos con id:', id);

          this.cargandoAlumnos = true;
          this.errorAlumnos = null;
          this.alumnos = [];
          this.claseSeleccionadaId = id;

          this.claseService.getAlumnosDeClase(id).subscribe({
            next: (rows) => {
              console.log('Alumnos recibidos:', rows);
              this.alumnos = rows;
              this.mostrarTablaAlumnos = true;
              this.cargandoAlumnos = false;
            },
            error: (err) => {
              console.error('Error cargando alumnos:', err);
              this.errorAlumnos = 'No se pudieron cargar los alumnos';
              this.cargandoAlumnos = false;
            }
          });
        }

        toggleTablaAlumnos(id: number): void {
          if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === id) {
            this.mostrarTablaAlumnos = false;
            this.claseSeleccionadaId = null;
            return;
          }
          this.cargarAlumnos(id);
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


        eliminarAlumnoDeClase(a: Alumno): void {
          if (!a.alumno_reservation_id) {
            alert('No se encontró la reserva de este alumno.');
            return;
          }
          if (!confirm(`¿Eliminar la reserva de ${a.alumno_nombre}?`)) return;

          this.eliminandoId = a.alumno_reservation_id;

          this.reservationService.eliminarReservation(a.alumno_reservation_id).subscribe({
            next: () => {
              // Quita de la UI inmediatamente
              this.alumnos = this.alumnos.filter(x => x.alumno_reservation_id !== a.alumno_reservation_id);

              // Refresca la subtabla por si el backend recalcula algo
              if (this.claseSeleccionadaId != null) {
                this.cargarAlumnos(this.claseSeleccionadaId);
              }
              this.cargarClasesProfesores();
            },
            error: (err) => {
              console.error('Error eliminando reserva', err);
              alert(err?.error?.error ?? 'No se pudo eliminar la reserva');
            },
            complete: () => this.eliminandoId = null
          });
        }
      }