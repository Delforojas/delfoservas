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

  getClases(): Observable<ClaseDto[]> {
    return this.http.get<ClaseDto[]>(CLASES_ROUTES.list(), { headers: authHeaders() });
  }

  getClasesVista(): Observable<VistaClase[]> {
    return this.http.get<VistaClase[]>(CLASES_ROUTES.vista(), { headers: authHeaders() });
  }

  crearClase(data: Omit<Clase, 'id'>): Observable<any> {
    return this.http.post(CLASES_ROUTES.create(), data, { headers: authHeaders() });
  }


  eliminarClase(id: number): Observable<any> {
    return this.http.delete(CLASES_ROUTES.delete(id), { headers: authHeaders() });
  }

  getMisClases(): Observable<ClaseProfe[]> {
    return this.http.get<ClaseProfe[]>(CLASES_ROUTES.mias(), { headers: authHeaders() });
  }

  getAlumnosDeClase(id: number): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(CLASES_ROUTES.alumnosClase(id), { headers: authHeaders() });
  }
}