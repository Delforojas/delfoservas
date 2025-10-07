import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../interfaces/room.interface';
import { ROOM_ROUTES } from '../routes/room-routes';
import { authHeaders } from '../utils/auth-headers';  

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(ROOM_ROUTES.list(), { headers: authHeaders() });
  }

}