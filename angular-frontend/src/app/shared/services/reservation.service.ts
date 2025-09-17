// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id: number;
  usuario_id: number;
  clase_id: number;
  bono_id: number;
}

// 👇 ajusta la interfaz al DTO real que devuelves en tu /api/clases
export interface ClaseDto {
  id: number;
  nombre: string;
  aforo_clase: number;
  plazas: number;
  fecha: string;
  hora: string;
  dia: string;
  completa: boolean;
  profesor?: string | null;
  sala?: string | null;
  // opcionalmente:
  teacher?: string | null;
  room?: string | null;
}
export interface VistaClase {
  id: number;
  nombre: string;
  aforo_clase: number;
  fecha: string;   // YYYY-MM-DD
  hora: string;    // HH:mm
  dia: string;     // <- usa texto ('Lunes','Martes'...) si tu vista lo devuelve así
  profesor?: string | null;
  sala?: string | null;
  tipoclase_id: number;
  tipoclase_nombre: string;
  reservas: number;
  plazas: number;
  completa: boolean;

  // opcional, por si a veces te llega el id crudo
  teacher?: number;
  room?: number;

  reservation_id?: number | null;
}

export interface BonoActivoUsuario {
  usuario_id: number;
  usuario_nombre: string;
  email: string;
  bono_id: number;
  tipoclase: number;
  clases_totales: number;
  clases_restantes: number;
  estado: 'activo' | 'inactivo' | string; // ajusta si solo usas 'activo'
  fecha_wallet: string; // YYYY-MM-DD
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ listar clases
  getClases(): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(`${this.apiUrl}/clases`, {
      headers: this.authHeaders(),
    });
  }

  // ✅ reservar clase (POST /api/reservar/{id})
 reservarClase(claseId: number) {
  return this.http.post(`${this.apiUrl}/reservations/reservar/${claseId}`, {}, {
    headers: this.authHeaders(),
  });
}

  // ✅ listar todas las reservas
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/reservations`, {
      headers: this.authHeaders(),
    });
  }

  // ✅ obtener una reserva
  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/reservations/${id}`, {
      headers: this.authHeaders(),
    });
  }

  // ✅ crear reserva (POST /api/reservations/create)
  crearReservation(data: { usuario_id: number; clase_id: number; bono_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations/create`, data, {
      headers: this.authHeaders(),
    });
  }

  // ✅ actualizar reserva (PUT /api/reservations/update/{id})
  actualizarReservation(id: number, data: Partial<Reservation>): Observable<any> {
    return this.http.put(`${this.apiUrl}/reservations/update/${id}`, data, {
      headers: this.authHeaders(),
    });
  }

  // ✅ eliminar reserva (DELETE /api/reservations/delete/{id})
  eliminarReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/delete/${id}`, {
      headers: this.authHeaders(),
    });
  }
  getClasesLunes(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(`${this.apiUrl}/reservations/clases/lunes`, { headers: this.authHeaders() });
  }
  getClasesMartes(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(`${this.apiUrl}/reservations/clases/martes`, { headers: this.authHeaders() });
  }
  getClasesMiercoles(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(`${this.apiUrl}/reservations/clases/miercoles`, { headers: this.authHeaders() });
  }
  getClasesJueves(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(`${this.apiUrl}/reservations/clases/jueves`, { headers: this.authHeaders() });
  }
  getClasesViernes(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(`${this.apiUrl}/reservations/clases/viernes`, { headers: this.authHeaders() });
  }



}


