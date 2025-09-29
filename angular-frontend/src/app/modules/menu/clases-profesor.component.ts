import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaseService} from '../../shared/services/clases.service';
import { AuthService } from '../../shared/services/auth.service';
import { ReservationService } from '../../shared/services/reservation.service';

import { Clase } from '../../shared/interfaces/clase.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ClaseProfe } from '../../shared/interfaces/claseProfe.interface';
import { Alumno } from '../../shared/interfaces/alumno.interface'

import {
  loadClases,
  loadClasesVista,
  loadClasesProfesores,
  loadAlumnos,
  deleteClase,
  deleteAlumnoDeClase,
} from '../../shared/utils/load';

import { RouterModule } from '@angular/router';
import { handleHttpError } from '../../shared/utils/http-error';
import { ToastService } from '../../shared/services/toast.service';


@Component({
  selector: 'app-clases-profesor',
  standalone: true,
  imports: [CommonModule,  RouterModule],
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
            public auth: AuthService,
            private toast: ToastService
            ) {}

          ngOnInit(): void {
            loadClases(this);
            loadClasesVista(this);
            loadClasesProfesores(this);
          }
        
          eliminarClase(id: number): void {
            deleteClase(this, id);
          }

          eliminarAlumnoDeClase(a: any): void {
            deleteAlumnoDeClase(this, a);
          }

        

        toggleTablaAlumnos(id: number): void {
          if (this.mostrarTablaAlumnos && this.claseSeleccionadaId === id) {
            this.mostrarTablaAlumnos = false;
            this.claseSeleccionadaId = null;
            return;
          }
          loadAlumnos(this, id);
        }

        
      }