// src/app/services/wallet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../interfaces/wallet.interface';
import { WALLET_ROUTES } from '../routes/wallet-routes';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Obtener todas las wallets
  getWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(WALLET_ROUTES.all(), { headers: this.authHeaders() });
  }

  // ✅ Obtener una wallet por ID
  getWallet(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(WALLET_ROUTES.byId(id), { headers: this.authHeaders() });
  }

  // ✅ Crear wallet
  crearWallet(data: { fecha: string; usuario_id: number; tipoclase_id: number }): Observable<any> {
    return this.http.post(WALLET_ROUTES.create(), data, { headers: this.authHeaders() });
  }

  // ✅ Eliminar wallet
  eliminarWallet(id: number): Observable<any> {
    return this.http.delete(WALLET_ROUTES.delete(id), { headers: this.authHeaders() });
  }
}