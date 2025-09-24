// src/app/services/room.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/room.interface';
import { ROOM_ROUTES } from '../routes/room-routes';

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Obtener todas las salas
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(ROOM_ROUTES.list(), { headers: this.authHeaders() });
  }

  // ✅ Obtener una sala por ID
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(ROOM_ROUTES.byId(id), { headers: this.authHeaders() });
  }

  // ✅ Crear sala
  crearRoom(data: { descripcion: string; aforo_sala: number }): Observable<any> {
    return this.http.post(ROOM_ROUTES.create(), data, { headers: this.authHeaders() });
  }

  // ✅ Actualizar sala
  actualizarRoom(id: number, data: Partial<Room>): Observable<any> {
    return this.http.put(ROOM_ROUTES.update(id), data, { headers: this.authHeaders() });
  }

  // ✅ Eliminar sala
  eliminarRoom(id: number): Observable<any> {
    return this.http.delete(ROOM_ROUTES.delete(id), { headers: this.authHeaders() });
  }
}