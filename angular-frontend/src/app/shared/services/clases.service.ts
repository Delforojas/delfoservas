// src/app/services/clase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../interfaces/clase.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
import { ClaseProfe } from '../interfaces/claseProfe.interface';
import { Alumno } from '../interfaces/alumno.interface';
import { CLASES_ROUTES } from '../routes/clases-routes';
import { authHeaders } from '../utils/auth-headers'; 
import { ClaseDto } from '../interfaces/ClaseDto.interface';


@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  constructor(private http: HttpClient) {}

  // Obtener todas las clases
  getClases(): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(CLASES_ROUTES.list(), { headers: authHeaders() });
  }
  
  // Vista de clases
  getClasesVista(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(CLASES_ROUTES.vista(), { headers: authHeaders() });
  }

  // Obtener una clase por ID
  getClase(id: number): Observable<Clase> {
    return this.http.get<Clase>(CLASES_ROUTES.byId(id), { headers: authHeaders() });
  }

  // Crear una clase
  crearClase(data: Omit<Clase, 'id'>): Observable<any> {
    return this.http.post(CLASES_ROUTES.create(), data, { headers: authHeaders() });
  }

  // Actualizar una clase
  actualizarClase(id: number, data: Partial<Clase>): Observable<any> {
    return this.http.put(CLASES_ROUTES.update(id), data, { headers: authHeaders() });
  }

  // Eliminar una clase
  eliminarClase(id: number): Observable<any> {
    return this.http.delete(CLASES_ROUTES.delete(id), { headers: authHeaders() });
  }

  // Clases del profesor autenticado
  getMisClases(): Observable<ClaseProfe[]> {
    return this.http.get<ClaseProfe[]>(CLASES_ROUTES.mias(), { headers: authHeaders() });
  }

  // Alumnos de una clase
  getAlumnosDeClase(id: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(CLASES_ROUTES.alumnosClase(id), { headers: authHeaders() });
  }
}