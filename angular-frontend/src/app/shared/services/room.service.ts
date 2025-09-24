// src/app/services/room.service.ts
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/room.interface';


@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8000/api/room'; // Cambia según tu backend

  
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }


  // Obtener todas las salas
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl,  { headers: this.authHeaders() });
  }

  // Obtener una sala por ID
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`,  { headers: this.authHeaders() });
  }

  // Crear sala
  crearRoom(data: { descripcion: string; aforo_sala: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create` , data , { headers: this.authHeaders() });
  }

  // Actualizar sala
  actualizarRoom(id: number, data: Partial<Room>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data ,  { headers: this.authHeaders() });
  }

  // Eliminar sala
  eliminarRoom(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.authHeaders() });
  }
}