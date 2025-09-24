import { environment } from "../../environments/environments";

export const API_URL = environment.endpointUrl;

export const RESERVATION_ROUTES = {
  // clases (catálogo)
  clases:           () => `${API_URL}/clases`,

  // reservas CRUD
  list:             () => `${API_URL}/reservations`,
  byId:             (id: number) => `${API_URL}/reservations/${id}`,
  create:           () => `${API_URL}/reservations/create`,
  update:           (id: number) => `${API_URL}/reservations/update/${id}`,
  delete:           (id: number) => `${API_URL}/reservations/delete/${id}`,

  // acciones
  reservarClase:    (claseId: number) => `${API_URL}/reservations/reservar/${claseId}`,

  // vistas por día
  clasesLunes:      () => `${API_URL}/reservations/clases/lunes`,
  clasesMartes:     () => `${API_URL}/reservations/clases/martes`,
  clasesMiercoles:  () => `${API_URL}/reservations/clases/miercoles`,
  clasesJueves:     () => `${API_URL}/reservations/clases/jueves`,
  clasesViernes:    () => `${API_URL}/reservations/clases/viernes`,
};