// src/app/services/clase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../interfaces/clase.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import { ClaseProfe } from '../interfaces/claseProfe.interface';
import { Alumno } from '../interfaces/alumno.interface';
import { CLASES_ROUTES } from '../routes/clases-routes';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Obtener todas las clases
  getClases(): Observable<Clase[]> {
    return this.http.get<Clase[]>(CLASES_ROUTES.list(), { headers: this.authHeaders() });
  }

  // Vista de clases
  getClasesVista(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(CLASES_ROUTES.vista(), { headers: this.authHeaders() });
  }

  // Obtener una clase por ID
  getClase(id: number): Observable<Clase> {
    return this.http.get<Clase>(CLASES_ROUTES.byId(id), { headers: this.authHeaders() });
  }

  // Crear una clase
  crearClase(data: Omit<Clase, 'id'>): Observable<any> {
    return this.http.post(CLASES_ROUTES.create(), data, { headers: this.authHeaders() });
  }

  // Actualizar una clase
  actualizarClase(id: number, data: Partial<Clase>): Observable<any> {
    return this.http.put(CLASES_ROUTES.update(id), data, { headers: this.authHeaders() });
  }

  // Eliminar una clase
  eliminarClase(id: number): Observable<any> {
    return this.http.delete(CLASES_ROUTES.delete(id), { headers: this.authHeaders() });
  }

  // Clases del profesor autenticado
  getMisClases(): Observable<ClaseProfe[]> {
    return this.http.get<ClaseProfe[]>(CLASES_ROUTES.mias(), { headers: this.authHeaders() });
  }

  // Alumnos de una clase
  getAlumnosDeClase(id: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(CLASES_ROUTES.alumnosClase(id), { headers: this.authHeaders() });
  }
}