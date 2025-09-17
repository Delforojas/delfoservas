import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RoomService, Room } from '../../shared/services/room.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule , RouterModule],
  templateUrl: './room.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  rooms: Room[] = [];
  roomSeleccionada: Room | null = null;
  nuevaDescripcion = '';
  nuevoAforo = 0;
  error: string | null = null;
  cargando = false;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.cargarRooms();
  }

  cargarRooms(): void {
    this.cargando = true;
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar las salas';
        this.cargando = false;
      }
    });
  }

  crearRoom(): void {
    if (!this.nuevaDescripcion || this.nuevoAforo <= 0) return;

    this.roomService.crearRoom({
      descripcion: this.nuevaDescripcion,
      aforo_sala: this.nuevoAforo
    }).subscribe({
      next: () => {
        this.nuevaDescripcion = '';
        this.nuevoAforo = 0;
        this.cargarRooms();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear sala';
      }
    });
  }

  seleccionarRoom(room: Room): void {
    this.roomSeleccionada = room;
  }

  eliminarRoom(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta sala?')) {
      this.roomService.eliminarRoom(id).subscribe({
        next: () => this.cargarRooms(),
        error: (err) => {
          console.error(err);
          this.error = 'Error al eliminar la sala';
        }
      });
    }
  }
}