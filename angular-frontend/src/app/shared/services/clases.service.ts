// src/app/services/clase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Clase {
  id: number;
  nombre: string;
  tipoclase: number; 
  teacher: number;   
  fecha: string;     
  hora: string;     
  aforo_clase: number;
  room: number;      
}

export interface VistaClase {
  id: number;
  nombre: string;
  aforo_clase: number;
  fecha: string;   // YYYY-MM-DD
  hora: string;    // HH:mm
  dia: string;     // <- usa texto ('Lunes','Martes'...) si tu vista lo devuelve así
  profesor?: string | null;
  sala?: string | null;
  tipoclase_id: number;
  tipoclase_nombre: string;
  reservas: number;
  plazas: number;
  completa: boolean;

  // opcional, por si a veces te llega el id crudo
  teacher?: number;
  room?: number;

    usuario_id: number | null;
  reservation_id: number | null;
}

export interface ClaseProfe {
  id: number;
  nombre: string;
  fecha: string;           
  hora: string;            
  sala: string;
  nombre_tipoclase: string;
  aforo_clase: number;
  plazas: number;
  completa: boolean;
}
 export interface Alumno {
  alumno_reservation_id: number | null;  
  alumno_id: number;
  alumno_nombre: string;
  alumno_email: string;
}

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
