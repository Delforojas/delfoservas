// src/app/services/bonos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bono } from '../interfaces/bono.interface';
import { BonoActivoUsuario } from '../interfaces/bonoActivoUsuario.interface';
import { BONOS_ROUTES } from '../routes/bonos-routhes';

@Injectable({
  providedIn: 'root'
})
export class BonosService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Obtener todos los bonos
  getBonos(): Observable<Bono[]> {
    return this.http.get<Bono[]>(BONOS_ROUTES.list(), { headers: this.authHeaders() });
  }

  // Obtener un bono por ID
  getBono(id: number): Observable<Bono> {
    return this.http.get<Bono>(BONOS_ROUTES.byId(id), { headers: this.authHeaders() });
  }

  // Crear un bono
  crearBono(data: Omit<Bono, 'id'>): Observable<any> {
    return this.http.post(BONOS_ROUTES.create(), data, { headers: this.authHeaders() });  
  }

  // Actualizar un bono
  actualizarBono(id: number, data: Partial<Bono>): Observable<any> {
    return this.http.put(BONOS_ROUTES.update(id), data, { headers: this.authHeaders() });
  }

  // Eliminar un bono
  eliminarBono(id: number): Observable<any> {
    return this.http.delete(BONOS_ROUTES.delete(id), { headers: this.authHeaders() });
  }

  // Bonos activos de un usuario
  getBonosActivos(usuarioId: number): Observable<BonoActivoUsuario[]> {
    return this.http.get<BonoActivoUsuario[]>(BONOS_ROUTES.activosUser(usuarioId), {
      headers: this.authHeaders()
    });
  }
}