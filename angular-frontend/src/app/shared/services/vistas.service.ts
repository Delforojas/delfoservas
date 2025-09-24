// src/app/services/vistas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReservaUsuarioDto } from '../interfaces/reservaUsuarioDto.interface';
import { VISTAS_ROUTES } from '../routes/vistas-routes';

@Injectable({ providedIn: 'root' })
export class VistasService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ─────────── BONOS (VISTAS) ───────────
  getBonos(): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonos(), { headers: this.authHeaders() });
  }

  getBonosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonosByUser(usuarioId), { headers: this.authHeaders() });
  }

  // ─────────── CLASES / RESERVAS POR USUARIO ───────────
  getClasesPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.clasesByUser(usuarioId), { headers: this.authHeaders() });
  }

  getReservasPorUsuario(usuarioId: number): Observable<ReservaUsuarioDto[]> {
    return this.http.get<ReservaUsuarioDto[]>(VISTAS_ROUTES.reservasByUser(usuarioId), { headers: this.authHeaders() });
  }

  getWalletPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.walletByUser(usuarioId), { headers: this.authHeaders() });
  }

  getBonosVistaPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.bonosVistaByUser(usuarioId), { headers: this.authHeaders() });
  }

  // ─────────── PROFES/CLASES ───────────
  getAlumnosPorClase(claseId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.alumnosByClase(claseId), { headers: this.authHeaders() });
  }

  getTotalAlumnosPorClase(claseId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.totalAlumnosClase(claseId), { headers: this.authHeaders() });
  }

  // ─────────── BASE API (fuera de /vistas) ───────────
  getUsuarios() {
    return this.http.get<Array<{ id: number; nombre: string; email: string }>>(
      VISTAS_ROUTES.usuarios(), { headers: this.authHeaders() }
    );
  }

  getClases() {
    return this.http.get<Array<{ id: number; nombre: string }>>(
      VISTAS_ROUTES.clases(), { headers: this.authHeaders() }
    );
  }

  // ─────────── VISTA: usuario-wallet ───────────
  getVistaUsuarioWalletAll(): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.usuarioWalletAll(), { headers: this.authHeaders() });
  }

  getVistaUsuarioWalletByUser(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.usuarioWalletById(usuarioId), { headers: this.authHeaders() });
  }

  getWalletMes(mes: string): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.walletMes(mes), { headers: this.authHeaders() });
  }

  getMesesWallet(): Observable<string[]> {
    return this.http.get<string[]>(VISTAS_ROUTES.walletMeses(), { headers: this.authHeaders() });
  }

  getWalletPorTipoClase(id: number): Observable<any[]> {
    return this.http.get<any[]>(VISTAS_ROUTES.walletPorTipo(id), { headers: this.authHeaders() });
  }

  getWalletPorMesYTipo(mes: string, tipoclaseId: number): Observable<any[]> {
    const params = new HttpParams()
      .set('mes', mes)
      .set('tipoclaseId', String(tipoclaseId));

    return this.http.get<any[]>(VISTAS_ROUTES.walletFiltrar(), {
      headers: this.authHeaders(),
      params
    });
  }
}