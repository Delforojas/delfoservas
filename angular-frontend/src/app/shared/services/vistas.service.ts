// src/app/services/vistas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaUsuarioDto } from '../interfaces/reservaUsuarioDto.interface';
import { WalletMes } from '../interfaces/walletMes.interface';


@Injectable({ providedIn: 'root' })
export class VistasService {
  private base = 'http://localhost:8000';
  private vistasBase = `${this.base}/api/vistas`;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  
  
  getBonos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/vistabonos`, { headers: this.authHeaders() });
  }

  getBonosPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/vistabonos/${usuarioId}`, { headers: this.authHeaders() });
  }




  // ─────────── RESTO (API vistas) ───────────
  getClasesPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/usuarioclases/${usuarioId}/clases`, { headers: this.authHeaders() });
  }

  getReservasPorUsuario(usuarioId: number): Observable<ReservaUsuarioDto[]> {
    return this.http.get<ReservaUsuarioDto[]>(`${this.vistasBase}/usuarioreservas/${usuarioId}/reservas`, { headers: this.authHeaders() });
  }

  getWalletPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/usuariowallet/${usuarioId}/wallet`, { headers: this.authHeaders() });
  }

  getBonosVistaPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/usuariobonos/${usuarioId}/bonos`, { headers: this.authHeaders() });
  }

  getAlumnosPorClase(claseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/claseprofe/${claseId}/clasealumnos`, { headers: this.authHeaders() });
  }

  getTotalAlumnosPorClase(claseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.vistasBase}/claseprofe/${claseId}/total-alumnos`, { headers: this.authHeaders() });
  }

  getUsuarios() {
    return this.http.get<Array<{ id: number; nombre: string; email: string }>>(
      `${this.base}/api/users`, { headers: this.authHeaders() }
    );
  }

  getClases() {
    // Asegúrate de que exista /api/clases en tu backend
    return this.http.get<Array<{ id: number; nombre: string }>>(
      `${this.base}/api/clases`, { headers: this.authHeaders() }
    );
  }
 



  // ─────────── VISTA: usuario-wallet ───────────
getVistaUsuarioWalletAll(): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.vistasBase}/usuario-wallet`,
    { headers: this.authHeaders() }
  );
}

getVistaUsuarioWalletByUser(usuarioId: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.vistasBase}/usuario-wallet/${usuarioId}`,
    { headers: this.authHeaders() }
  );
}

getWalletMes(mes: string) {
  return this.http.get<any[]>(`${this.vistasBase}/wallet/mes/${encodeURIComponent(mes)}`,
    { headers: this.authHeaders() });
}

getMesesWallet(): Observable<string[]> {
  return this.http.get<string[]>(`${this.vistasBase}/wallet/meses`, { headers: this.authHeaders() });
}
getWalletPorTipoClase(id: number): Observable<any[]> {
  return this.http.get<any[]>(
    `${this.vistasBase}/wallet/tipoclase/${id}`,
    { headers: this.authHeaders() }
  );
}


 getWalletPorMesYTipo(mes: string, tipoclaseId: number): Observable<any[]> {
    const params = new HttpParams()
      .set('mes', mes)                          // ej: 'August'
      .set('tipoclaseId', String(tipoclaseId)); // ej: 1

    return this.http.get<any[]>(
      `${this.vistasBase}/wallet/filtrar`,
      { headers: this.authHeaders(), params }
    );
  }

}