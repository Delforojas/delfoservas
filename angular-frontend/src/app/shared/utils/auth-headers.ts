import { HttpHeaders } from '@angular/common/http';

export function authHeaders(): HttpHeaders {
  const token = localStorage.getItem('token') || '';
  console.log('Token usado en headers:', token); // 👀 log para comprobar
  return new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });
}