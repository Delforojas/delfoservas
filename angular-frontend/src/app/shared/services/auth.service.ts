import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_ROUTES } from '../routes/auth-routes';
import { authHeaders } from '../utils/auth-headers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private roles: string[] = [];

  constructor(private http: HttpClient, private router: Router) { }

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

  login(data: any): Observable<any> {
  return this.http.post<{ token: string }>(AUTH_ROUTES.login(), data).pipe(
    tap(res => {
      localStorage.setItem('token', res.token);
      
      this.getUser().subscribe(user => {
        this.setRoles(user?.roles || []);
      });
    })
  );
}
/*
  getUser(): Observable<any> {
    return this.http.get(AUTH_ROUTES.me(), {
      headers: authHeaders()
    });
  }*/
 getUser(): Observable<any> {
  const headers = authHeaders();
  return this.http.get(AUTH_ROUTES.me(), { headers });
}
}