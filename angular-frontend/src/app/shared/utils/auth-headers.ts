import { HttpHeaders } from '@angular/common/http';

export function authHeaders(): HttpHeaders {
  const token = localStorage.getItem('token') || '';
  return new HttpHeaders({ Authorization: `Bearer ${token}` });
}