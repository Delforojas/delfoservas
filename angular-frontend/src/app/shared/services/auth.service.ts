import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AUTH_ROUTES } from '../routes/auth-routes';
import { authHeaders } from '../utils/auth-headers';
import { USERS_ROUTES } from '../routes/user-routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private roles: string[] = [];

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

login(data: any): Observable<any> {
  return this.http.post<{ token: string }>(AUTH_ROUTES.login(), data).pipe(
    tap(res => {
      console.log("🔑 Token recibido del backend:", res.token);  // 👀 aquí lo ves
      localStorage.setItem('token', res.token);

      this.getUser().subscribe(user => {
        console.log("👤 Usuario cargado con token:", user);      // 👀 confirmas que funciona
        this.setRoles(user?.roles || []);
      });
    })
  );
}
  
getUser(): Observable<any> {
  return this.http.get(AUTH_ROUTES.me(), {   // ✅ aquí antes tenías USERS_ROUTES.me()
    headers: authHeaders()
  });
}
register(data: any) {
  return this.http.post(AUTH_ROUTES.register(), data );
}




}