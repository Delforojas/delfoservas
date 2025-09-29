import { API } from "../../environments/environments";

const RESERVATIONS = `${API}/reservations`;


export const RESERVATION_ROUTES = {

  // reservas CRUD
  list:             () => RESERVATIONS,
  byId:             (id: number) => `${RESERVATIONS}/${id}`,
  create:           () => RESERVATIONS,
  update:           (id: number) => `${RESERVATIONS}/${id}`,
  delete:           (id: number) => `${RESERVATIONS}/${id}`,

  // acciones
  reservarClase:    (claseId: number) => `${RESERVATIONS}/reservar/${claseId}`,

  // vistas por día
  clasesLunes:      () => `${RESERVATIONS}/clases/lunes`,
  clasesMartes:     () => `${RESERVATIONS}/clases/martes`,
  clasesMiercoles:  () => `${RESERVATIONS}/clases/miercoles`,
  clasesJueves:     () => `${RESERVATIONS}/clases/jueves`,
  clasesViernes:    () => `${RESERVATIONS}/clases/viernes`,

   reservasPorDia: (userId: number, dia: string) => `${RESERVATIONS}/usuarios/${userId}/reservas/${dia}`,
};