// src/app/services/wallet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Wallet {
  id: number;
  fecha: string; // formato YYYY-MM-DD
  usuario_id: number;
  tipoclase_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8000/api/wallet'; // Cambia según la URL de tu backend

  constructor(private http: HttpClient) {}
  
    private authHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
      }
    
  

  // Obtener todas las wallets
  getWallets(): Observable<Wallet[]> {
    return this.http.get<Wallet[]>(this.apiUrl ,{ headers: this.authHeaders() });
  }

  // Obtener una wallet por ID
  getWallet(id: number): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/${id}`,{ headers: this.authHeaders() });
  }

  // Crear wallet
  crearWallet(data: { fecha: string; usuario_id: number; tipoclase_id: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data,{ headers: this.authHeaders() });
  }

  // Eliminar wallet
  eliminarWallet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`,{ headers: this.authHeaders() });
  }
}