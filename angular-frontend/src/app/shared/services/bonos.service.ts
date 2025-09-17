// src/app/services/bonos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bono {
  id: number;
  clases_restantes: number;
  clases_totales: number;
  fecha: string; // formato YYYY-MM-DD
  estado: string;
  tipoclase_id: number;
  wallet_id: number;
}

export interface BonoActivoUsuario {
  usuario_id: number;
  usuario_nombre: string;
  email: string;
  bono_id: number;
  tipoclase: number;
  nombre_tipoclase: string;
  clases_totales: number;
  clases_restantes: number;
  estado: string;
  fecha_wallet: string;
   mes: string;    
}

@Injectable({
  providedIn: 'root'
})
export class BonosService {
  private apiUrl = 'http://localhost:8000/api/bonos'; // Cambia según tu backend

  constructor(private http: HttpClient) {}
    
      private authHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
      }
    

  // Obtener todos los bonos
  getBonos(): Observable<Bono[]> {
    return this.http.get<Bono[]>(this.apiUrl);
  }

  // Obtener un bono por ID
  getBono(id: number): Observable<Bono> {
    return this.http.get<Bono>(`${this.apiUrl}/${id}`,{ headers: this.authHeaders() });
  }

  // Crear un bono
  crearBono(data: Omit<Bono, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data,{ headers: this.authHeaders() });  
  }

  // Actualizar un bono
  actualizarBono(id: number, data: Partial<Bono>): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data,{ headers: this.authHeaders() });
  }

  // Eliminar un bono
  eliminarBono(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`,{ headers: this.authHeaders() });
  }


getBonosActivos(usuarioId: number): Observable<BonoActivoUsuario[]> {
  return this.http.get<BonoActivoUsuario[]>(
    `${this.apiUrl}/usuario/${usuarioId}/bono-activo`, // 👈 usa el que ya tienes en Symfony
    { headers: this.authHeaders() }
  );
}

}