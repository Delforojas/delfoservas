// src/app/services/tipoclase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoClase } from '../interfaces/tipoClase.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoClaseService {
  private apiUrl = 'http://localhost:8000/api/tipoclase'; // Cambia si tu backend está en otra URL

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
      const token = localStorage.getItem('token') || '';
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
  

  // Obtener todos los tipos de clase
  getTipos(): Observable<TipoClase[]> {
    return this.http.get<TipoClase[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  // Obtener un tipo de clase por ID
  getTipo(id: number): Observable<TipoClase> {
    return this.http.get<TipoClase>(`${this.apiUrl}/${id}`,  { headers: this.authHeaders() });
  }

  // Crear tipo de clase
  crearTipo(data: { nombre: string; clases_totales: number }): Observable<any> {
    return this.http.post(this.apiUrl, data,  { headers: this.authHeaders() });
  }

  // Actualizar tipo de clase
  actualizarTipo(id: number, data: Partial<TipoClase>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data,  { headers: this.authHeaders() });
  }

  // Eliminar tipo de clase
  eliminarTipo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`,  { headers: this.authHeaders() });
  }
}