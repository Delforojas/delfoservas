// src/app/services/clase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../interfaces/clase.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import {ClaseProfe} from '../interfaces/claseProfe.interface';
import { Alumno } from '../interfaces/Alumno.interface';
@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private apiUrl = 'http://localhost:8000/api/clases'; // Cambia según tu backend

  constructor(private http: HttpClient) {}
  
    private authHeaders(): HttpHeaders {
      const token = localStorage.getItem('token') || '';
      return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }
  

  // Obtener todas las clases
getClases(): Observable<Clase[]> {
  return this.http.get<Clase[]>(this.apiUrl, { headers: this.authHeaders() });
}
getClasesVista(): Observable<VistaClase[]> {
  return this.http.get<VistaClase[]>(`${this.apiUrl}/vista`, { headers: this.authHeaders() }); // 👉 /api/clases (vista)
}
  // Obtener una clase por ID
  getClase(id: number): Observable<Clase> {
    return this.http.get<Clase>(`${this.apiUrl}/${id}`,{ headers: this.authHeaders() });
  }

  // Crear una clase
  crearClase(data: Omit<Clase, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data,{ headers: this.authHeaders() });
  }

  // Actualizar una clase
  actualizarClase(id: number, data: Partial<Clase>): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data,{ headers: this.authHeaders() });
  }

  // Eliminar una clase
  eliminarClase(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`,{ headers: this.authHeaders() });
  }
  

  getMisClases(): Observable<ClaseProfe[]> {
    return this.http.get<ClaseProfe[]>(`${this.apiUrl}/mias`,{ headers: this.authHeaders() });
  }
  getAlumnosDeClase(id: number) {
  return this.http.get<Alumno[]>(`${this.apiUrl}/alumnos/${id}`,{ headers: this.authHeaders() });
}


}
