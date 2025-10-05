// src/app/services/vistas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReservaUsuarioDto } from '../interfaces/reservaUsuarioDto.interface';
import { VISTAS_ROUTES } from '../routes/vistas-routes';
import { authHeaders } from '../utils/auth-headers';  // 👈 Importas la función


@Injectable({ providedIn: 'root' })
export class VistasService {
  constructor(private http: HttpClient) {}

 
 

  getReservasPorUsuario(usuarioId: number): Observable<ReservaUsuarioDto[]> {
    return this.http.get<ReservaUsuarioDto[]>(VISTAS_ROUTES.reservasByUser(usuarioId), { headers: authHeaders() });
  }



  getVistaUsuarioWalletByUser(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.usuarioWalletById(usuarioId), { headers: authHeaders() });
  }

   getBonosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonosByUser(usuarioId), { headers: authHeaders() });
  }

}