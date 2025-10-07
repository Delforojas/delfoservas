import { HttpHeaders } from '@angular/common/http';

export function authHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token && token.trim() !== '') {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No hay token en localStorage, petición irá sin Authorization');
  }

  return new HttpHeaders(headers);
}