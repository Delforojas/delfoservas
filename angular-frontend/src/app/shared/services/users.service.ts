// src/app/services/users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string | null;
  email: string;
  roles?: string[];
  password?: string;
}

export interface Profesor {
  id: number;
  nombre: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private apiUrl = 'http://localhost:8000/api/users';
  

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Obtener todos los usuarios (GET /api/users)
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  // Obtener un usuario por id (GET /api/users/{id})
  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  // ⚠️ Crear usuario:
  // Tu API de creación está en /api/register (AuthController), no en /api/users/create.
  // Haz el registro con AuthService.register() desde el front.
  // Si más adelante expones POST /api/users, podrás añadirlo aquí.

  // Actualizar usuario (PUT /api/users/{id})
  actualizarUsuario(id: number, data: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.authHeaders() });
  }

  // Eliminar usuario (DELETE /api/users/{id})
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

   getProfesores(): Observable<Profesor[]> {
  return this.http.get<Profesor[]>(`${this.apiUrl}/profesores`, { headers: this.authHeaders() });
}
}