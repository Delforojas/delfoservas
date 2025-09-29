// src/app/services/tipoclase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoClase } from '../interfaces/tipoClase.interface';
import { TIPO_CLASE_ROUTES } from '../routes/tipo-clase-routes';
import { authHeaders } from '../utils/auth-headers';

@Injectable({ providedIn: 'root' })
export class TipoClaseService {
  constructor(private http: HttpClient) {}


  // ✅ Obtener todos los tipos de clase
  getTipos(): Observable<TipoClase[]> {
    return this.http.get<TipoClase[]>(TIPO_CLASE_ROUTES.list(), { headers: authHeaders() });
  }

  // ✅ Obtener un tipo de clase por ID
  getTipo(id: number): Observable<TipoClase> {
    return this.http.get<TipoClase>(TIPO_CLASE_ROUTES.byId(id), { headers: authHeaders() });
  }

  // ✅ Crear tipo de clase
  crearTipo(data: { nombre: string; clases_totales: number }): Observable<any> {
    return this.http.post(TIPO_CLASE_ROUTES.create(), data, { headers: authHeaders() });
  }

  // ✅ Actualizar tipo de clase
  actualizarTipo(id: number, data: Partial<TipoClase>): Observable<any> {
    return this.http.put(TIPO_CLASE_ROUTES.update(id), data, { headers: authHeaders() });
  }

  // ✅ Eliminar tipo de clase
  eliminarTipo(id: number): Observable<any> {
    return this.http.delete(TIPO_CLASE_ROUTES.delete(id), { headers: authHeaders() });
  }
}