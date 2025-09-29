// src/app/services/bonos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bono } from '../interfaces/bono.interface';
import { BonoActivoUsuario } from '../interfaces/bonoActivoUsuario.interface';
import { BONOS_ROUTES } from '../routes/bonos-routes';
import { authHeaders } from '../utils/auth-headers'; 

@Injectable({
  providedIn: 'root'
})
export class BonosService {
  constructor(private http: HttpClient) {}


  // Obtener todos los bonos
  getBonos(): Observable<Bono[]> {
    return this.http.get<Bono[]>(BONOS_ROUTES.list(), { headers: authHeaders() });
  }

  // Obtener un bono por ID
  getBono(id: number): Observable<Bono> {
    return this.http.get<Bono>(BONOS_ROUTES.byId(id), { headers: authHeaders() });
  }

  // Crear un bono
  crearBono(data: Omit<Bono, 'id'>): Observable<any> {
    return this.http.post(BONOS_ROUTES.create(), data, { headers: authHeaders() });  
  }

  // Actualizar un bono
  actualizarBono(id: number, data: Partial<Bono>): Observable<any> {
    return this.http.put(BONOS_ROUTES.update(id), data, { headers: authHeaders() });
  }

  // Eliminar un bono
  eliminarBono(id: number): Observable<any> {
    return this.http.delete(BONOS_ROUTES.delete(id), { headers: authHeaders() });
  }

  // Bonos activos de un usuario
  /*getBonosActivos(usuarioId: number): Observable<BonoActivoUsuario[]> {
    return this.http.get<BonoActivoUsuario[]>(BONOS_ROUTES.activosUser(usuarioId), {
      headers: this.authHeaders()
    });
  }*/
}