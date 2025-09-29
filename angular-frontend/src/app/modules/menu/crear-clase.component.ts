import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClaseService} from '../../shared/services/clases.service';
import { TipoClaseService} from '../../shared/services/tipoclase.service';
import { RoomService } from '../../shared/services/room.service';
import { UsersService} from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';

import { Clase } from '../../shared/interfaces/clase.interface';
import { VistaClase } from '../../shared/interfaces/vistaClase.interface';
import { ClaseProfe } from '../../shared/interfaces/claseProfe.interface';
import { TipoClase } from '../../shared/interfaces/tipoClase.interface';
import { Alumno } from '../../shared/interfaces/alumno.interface';
import { Room } from '../../shared/interfaces/room.interface';
import { Profesor } from '../../shared/interfaces/profesor.interface';

import {
  loadClases,
  loadClasesVista,
  loadTiposClase,
  loadRooms,
  loadProfesores,
  loadClasesProfesores,
  loadAlumnos,
  crearClase,
} from '../../shared/utils/load';




import { RouterModule } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';




@Component({
  selector: 'app-crear-clase',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-clase.html',
  
})
export class CrearClaseComponent implements OnInit {
  clasesVista: VistaClase[] = [];
  clases: Clase[] = [];
   tiposClase: TipoClase[] = [];
  rooms: Room[] = [];          
  profesores: Profesor[] = [];
  clasesprofe: ClaseProfe[] = [];
  alumnos: Alumno[] = []; 

  nuevaClase: Omit<Clase, 'id'> = {
    nombre: '',
    tipoclase: 0,
    teacher: 0,
    fecha: '',
    hora: '',
    aforo_clase: 0,
    room: 0
  };
  cargando = false;
  error: string | null = null;

  claseSeleccionadaId: number | null = null;

  cargandoAlumnos = false;
  errorAlumnos: string | null = null;

  mostrarTabla = false;
  mostrarTablaProfesores = false;
  mostrarTablaAlumnos = false;

   constructor(
    private claseService: ClaseService,
    private tipoClaseService: TipoClaseService ,
    private roomService: RoomService,
    private usersService: UsersService,
    public auth: AuthService,
    private toast :ToastService
    


  ) {}

  ngOnInit(): void {
    loadClases(this);
    loadClasesVista(this);
    loadTiposClase(this);
    loadRooms(this);
    loadProfesores(this);
    loadClasesProfesores(this);
  }

 
crearClase(): void {
  crearClase(this);
}

}

