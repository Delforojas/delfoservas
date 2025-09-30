// src/app/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Reservation } from '../interfaces/reservation.interface';
import { VistaClase } from '../interfaces/vistaClase.interface';
// import { BonoActivoUsuario } from '../interfaces/bonoActivoUsuario.interface'; // <- si lo usas, descomenta

import { RESERVATION_ROUTES } from '../routes/reservation-routes';
import { authHeaders } from '../utils/auth-headers'; 

export type DiaSemana = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'sábado' | 'sabado' | 'domingo';

@Injectable({ providedIn: 'root' })
export class ReservationService {

  constructor(private http: HttpClient) {}



  // ---------- Reservar ----------
  reservarClase(claseId: number): Observable<any> {
    return this.http.post(RESERVATION_ROUTES.reservarClase(claseId), {}, {
      headers: authHeaders(),
    });
  }

  // ---------- CRUD de reservas ----------
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(RESERVATION_ROUTES.list(), {
      headers: authHeaders(),
    });
  }

  getReservation(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(RESERVATION_ROUTES.byId(id), {
      headers: authHeaders(),
    });
  }

  crearReservation(data: { usuario_id: number; clase_id: number; bono_id: number }): Observable<any> {
    return this.http.post(RESERVATION_ROUTES.create(), data, {
      headers: authHeaders(),
    });
  }

  actualizarReservation(id: number, data: Partial<Reservation>): Observable<any> {
    return this.http.put(RESERVATION_ROUTES.update(id), data, {
      headers: authHeaders(),
    });
  }

  eliminarReservation(id: number): Observable<any> {
    return this.http.delete(RESERVATION_ROUTES.delete(id), {
      headers: authHeaders(),
    });
  }

  // ---------- Vistas por día ----------
  getClasesPorDia(dia: 'lunes'|'martes'|'miercoles'|'jueves'|'viernes') {
  let url = '';
  switch (dia) {
    case 'lunes': url = RESERVATION_ROUTES.clasesLunes(); break;
    case 'martes': url = RESERVATION_ROUTES.clasesMartes(); break;
    case 'miercoles': url = RESERVATION_ROUTES.clasesMiercoles(); break;
    case 'jueves': url = RESERVATION_ROUTES.clasesJueves(); break;
    case 'viernes': url = RESERVATION_ROUTES.clasesViernes(); break;
    default: throw new Error(`Día no soportado: ${dia}`);
  }
  return this.http.get<VistaClase[]>(url, { headers: authHeaders() });
}

getClasesLunes()     { return this.getClasesPorDia('lunes'); }
getClasesMartes()    { return this.getClasesPorDia('martes'); }
getClasesMiercoles() { return this.getClasesPorDia('miercoles'); }
getClasesJueves()    { return this.getClasesPorDia('jueves'); }
getClasesViernes()   { return this.getClasesPorDia('viernes'); }

   getReservasPorDia(userId: number, dia: string): Observable<any[]> {
    return this.http.get<any[]>(RESERVATION_ROUTES.reservasPorDia(userId, dia), { headers: authHeaders() });
}
}