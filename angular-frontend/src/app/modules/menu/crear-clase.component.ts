import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ClaseService } from '../../shared/services/clases.service';
import { TipoClaseService } from '../../shared/services/tipoclase.service';
import { RoomService } from '../../shared/services/room.service';
import { UsersService } from '../../shared/services/user.service';
import { ToastService } from '../../shared/services/toast.service';

import { loadClases, loadTiposClase, loadRooms, loadProfesores, crearClase } from '../../shared/utils/load';
import { ClasesState, createInitialClasesState } from '../../shared/models/clases.models';
import { CrearClaseContext } from '../../shared/utils/interfaces';

@Component({
  selector: 'app-crear-clase',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-clase.html',
})
export class CrearClaseComponent implements OnInit, CrearClaseContext {
  state: ClasesState = createInitialClasesState();

  constructor(
    public claseService: ClaseService,
    public tipoClaseService: TipoClaseService,
    public roomService: RoomService,
    public usersService: UsersService,
    public toast: ToastService
  ) {}

  ngOnInit(): void {
    loadClases(this);
    loadTiposClase(this);
    loadRooms(this);
    loadProfesores(this);
  }

  crearClase(): void {
    crearClase(this);
  }
}