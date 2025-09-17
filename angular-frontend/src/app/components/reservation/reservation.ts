import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService, Reservation , } from '../../shared/services/reservation.service';
import { BonosService, BonoActivoUsuario , } from '../../shared/services/bonos.service';
import { ClaseService, Clase , } from '../../shared/services/clases.service';
import { RouterModule } from '@angular/router';
import { UsersService, Usuario } from '../../shared/services/users.service';


@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule , RouterModule],
  templateUrl: './reservation.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

      nuevaReserva: { usuario_id: number | null; clase_id: number | null; bono_id: number | null } = {
        usuario_id: null,
        clase_id: null,
        bono_id: null,
      };

      // fuentes de datos para los selects
      usuarios: Usuario[] = [];
      clases: Clase[] = [];
      bonosActivosUsuario: BonoActivoUsuario[] = []; // normalizamos a array

      // listado y estado
      reservas: Reservation[] = [];
      cargando = false;
      error: string | null = null;

  // si quieres mostrar info del bono elegido
  bonoActivoSeleccionado: BonoActivoUsuario | null = null;
  constructor(private reservationService: ReservationService,
    private claseService:ClaseService,
    private bonosService: BonosService, 
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarClases();
    this.cargarReservas();

  }


  cargarUsuarios(): void {
    this.usersService.getUsuarios().subscribe({
      next: (data: Usuario[]) => this.usuarios = data,
      error: (e) => console.error('Error cargando usuarios', e)
    });
  }

   cargarClases(): void {
    this.claseService.getClases().subscribe({
      next: (data: Clase[]) => this.clases = data,
      error: (e) => console.error('Error cargando clases', e)
    });
  }


  cargarReservas(): void {
    this.cargando = true;
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        this.reservas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar reservas';
        this.cargando = false;
      }
    });
  }
  
onUsuarioChange(uid: number | null): void {
  this.nuevaReserva.bono_id = null;
  this.bonoActivoSeleccionado = null;

  if (!uid) { this.bonosActivosUsuario = []; return; }

  this.bonosService.getBonosActivos(uid).subscribe({
    next: (lista) => this.bonosActivosUsuario = lista ?? [],
    error: () => this.bonosActivosUsuario = [],
  });
}

  onBonoChange(bonoId: number | null): void {
    this.bonoActivoSeleccionado =
      this.bonosActivosUsuario.find((b) => b.bono_id === bonoId) || null;
  }

  // ====== CRUD reserva ======
  crearReserva(): void {
    const r = this.nuevaReserva;
    if (!r.usuario_id || !r.clase_id || !r.bono_id) {
      alert('Selecciona usuario, clase y bono activo');
      return;
    }

    this.reservationService.crearReservation(r as any).subscribe({
      next: () => {
        // limpiar y recargar
        this.nuevaReserva = { usuario_id: null, clase_id: null, bono_id: null };
        this.bonoActivoSeleccionado = null;
        this.cargarReservas();
      },
      error: (err) => {
        this.error = 'Error al crear reserva';
        console.error(err);
      },
    });
  }

  eliminarReserva(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;

    this.reservationService.eliminarReservation(id).subscribe({
      next: () => this.cargarReservas(),
      error: (err) => {
        this.error = 'Error al eliminar reserva';
        console.error(err);
      },
    });
  }
}