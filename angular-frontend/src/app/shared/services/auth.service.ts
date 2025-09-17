import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private roles: string[] = []; // ✅ guardamos aquí los roles del usuario

  constructor(private http: HttpClient, private router: Router) {}

  // -------- Helpers de roles ----------
  setRoles(roles: string[] | string) {
    const arr = Array.isArray(roles) ? roles : [roles];
    this.roles = arr.map(r => r.toUpperCase());
  }

  getRoles(): string[] {
    return this.roles;
  }

  hasAnyRole(roles: string[]): boolean {
    const need = roles.map(r => r.toUpperCase());
    return need.some(r => this.roles.includes(r));
  }

  isAdmin(): boolean {
    return this.hasAnyRole(['ROLE_ADMIN']);
  }

  isTeacher(): boolean {
    return this.hasAnyRole(['ROLE_TEACHER']);
  }

  // -------- API ----------
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        // Después de loguear, traemos el usuario y guardamos roles
        this.getUser().subscribe(user => this.setRoles(user?.roles || []));
      })
    );
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.baseUrl}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap((user: any) => this.setRoles(user?.roles || [])) // ✅ guardamos roles
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.roles = []; // limpiamos roles
    this.router.navigate(['/login']);
  }
}