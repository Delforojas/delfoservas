// src/app/services/users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { Profesor } from '../interfaces/profesor.interface';
import { USERS_ROUTES } from '../routes/user-service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ Obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(USERS_ROUTES.list(), { headers: this.authHeaders() });
  }

  // ✅ Obtener un usuario por ID
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(USERS_ROUTES.byId(id), { headers: this.authHeaders() });
  }

  // ⚠️ Crear usuario:
  // Lo gestionas con AuthService.register() -> POST /api/register
  // No se implementa aquí porque el backend no tiene POST /api/users

  // ✅ Actualizar usuario
  actualizarUsuario(id: number, data: Partial<Usuario>): Observable<any> {
    return this.http.put(USERS_ROUTES.update(id), data, { headers: this.authHeaders() });
  }

  // ✅ Eliminar usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(USERS_ROUTES.delete(id), { headers: this.authHeaders() });
  }

  // ✅ Listar profesores
  getProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(USERS_ROUTES.profesores(), { headers: this.authHeaders() });
  }
}