import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { Profesor } from '../interfaces/profesor.interface';
import { USERS_ROUTES } from '../routes/user-routes';
import { authHeaders } from '../utils/auth-headers';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient ) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(USERS_ROUTES.list(), {  headers: authHeaders() });
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(USERS_ROUTES.byId(id), {  headers: authHeaders() });
  }

  register(data: any) {
  return this.http.post(USERS_ROUTES.register(), data );
}
  
  actualizarUsuario(id: number, data: Partial<Usuario>): Observable<any> {
    return this.http.put(USERS_ROUTES.update(id), data, {  headers: authHeaders() });
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(USERS_ROUTES.delete(id), {  headers: authHeaders() });
  }

  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(USERS_ROUTES.profesores(), {  headers: authHeaders() });
  }
}