// src/app/services/wallet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Wallet } from '../interfaces/wallet.interface';
import { WALLET_ROUTES } from '../routes/wallet-routes';
import { authHeaders } from '../utils/auth-headers'; 



@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private http: HttpClient) {}

  // ✅ Obtener todas las wallets
  getWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(WALLET_ROUTES.all(), { headers: authHeaders() });
  }

  // ✅ Obtener una wallet por ID
  getWallet(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(WALLET_ROUTES.byId(id), { headers: authHeaders() });
  }

  // ✅ Crear wallet
  crearWallet(data: { fecha: string; usuario_id: number; tipoclase_id: number }): Observable<any> {
    return this.http.post(WALLET_ROUTES.create(), data, { headers: authHeaders() });
  }

  // ✅ Eliminar wallet
  eliminarWallet(id: number): Observable<any> {
    return this.http.delete(WALLET_ROUTES.delete(id), { headers: authHeaders() });
  }
}