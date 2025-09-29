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

 
  // ─────────── BONOS (VISTAS) ───────────
  getBonos(): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonos(), { headers: authHeaders() });
  }

  getBonosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonosByUser(usuarioId), { headers: authHeaders() });
  }

  // ─────────── CLASES / RESERVAS POR USUARIO ───────────
  getClasesPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.clasesByUser(usuarioId), { headers: authHeaders() });
  }

  getReservasPorUsuario(usuarioId: number): Observable<ReservaUsuarioDto[]> {
    return this.http.get<ReservaUsuarioDto[]>(VISTAS_ROUTES.reservasByUser(usuarioId), { headers: authHeaders() });
  }

  getWalletPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.walletByUser(usuarioId), { headers: authHeaders() });
  }

  getBonosVistaPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonosVistaByUser(usuarioId), { headers: authHeaders() });
  }

  // ─────────── PROFES/CLASES ───────────
  getAlumnosPorClase(claseId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.alumnosByClase(claseId), { headers: authHeaders() });
  }

  getTotalAlumnosPorClase(claseId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.totalAlumnosClase(claseId), { headers: authHeaders() });
  }

  // ─────────── BASE API (fuera de /vistas) ───────────
  getUsuarios() {
    return this.http.get<Array<{ id: number; nombre: string; email: string }>>(
      VISTAS_ROUTES.usuarios(), { headers: authHeaders() }
    );
  }

  getClases() {
    return this.http.get<Array<{ id: number; nombre: string }>>(
      VISTAS_ROUTES.clases(), { headers: authHeaders() }
    );
  }

  // ─────────── VISTA: usuario-wallet ───────────
  getVistaUsuarioWalletAll(): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.usuarioWalletAll(), { headers: authHeaders() });
  }

  getVistaUsuarioWalletByUser(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.usuarioWalletById(usuarioId), { headers: authHeaders() });
  }

  getWalletMes(mes: string): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.walletMes(mes), { headers: authHeaders() });
  }

  getMesesWallet(): Observable<string[]> {
    return this.http.get<string[]>(VISTAS_ROUTES.walletMeses(), { headers: authHeaders() });
  }

  getWalletPorTipoClase(id: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.walletPorTipo(id), { headers: authHeaders() });
  }

  getWalletPorMesYTipo(mes: string, tipoclaseId: number): Observable<any[]> {
    const params = new HttpParams()
      .set('mes', mes)
      .set('tipoclaseId', String(tipoclaseId));

    return this.http.get<any[]>(VISTAS_ROUTES.walletFiltrar(), {
      headers: authHeaders(),
      params
    });
  }
}