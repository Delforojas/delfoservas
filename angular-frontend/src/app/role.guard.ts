import { CanMatchFn, Route, UrlSegment } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // 👈 v4 usa named export

type TokenPayload = { roles?: string[] };

export const canMatchRoles = (required: string[]): CanMatchFn =>
  (_route: Route, _segments: UrlSegment[]) => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = jwtDecode<TokenPayload>(token); // tipado opcional
      const roles = payload.roles ?? [];
      return required.some(r => roles.includes(r));
    } catch {
      return false;
    }
  };