// src/app/services/tipoclase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoClase } from '../interfaces/tipoClase.interface';
import { TIPO_CLASE_ROUTES } from '../routes/tipo-clase-routes';

@Injectable({ providedIn: 'root' })
export class TipoClaseService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Obtener todos los tipos de clase
  getTipos(): Observable<TipoClase[]> {
    return this.http.get<TipoClase[]>(TIPO_CLASE_ROUTES.list(), { headers: this.authHeaders() });
  }

  // ✅ Obtener un tipo de clase por ID
  getTipo(id: number): Observable<TipoClase> {
    return this.http.get<TipoClase>(TIPO_CLASE_ROUTES.byId(id), { headers: this.authHeaders() });
  }

  // ✅ Crear tipo de clase
  crearTipo(data: { nombre: string; clases_totales: number }): Observable<any> {
    return this.http.post(TIPO_CLASE_ROUTES.create(), data, { headers: this.authHeaders() });
  }

  // ✅ Actualizar tipo de clase
  actualizarTipo(id: number, data: Partial<TipoClase>): Observable<any> {
    return this.http.put(TIPO_CLASE_ROUTES.update(id), data, { headers: this.authHeaders() });
  }

  // ✅ Eliminar tipo de clase
  eliminarTipo(id: number): Observable<any> {
    return this.http.delete(TIPO_CLASE_ROUTES.delete(id), { headers: this.authHeaders() });
  }
}