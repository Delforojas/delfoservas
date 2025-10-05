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


}