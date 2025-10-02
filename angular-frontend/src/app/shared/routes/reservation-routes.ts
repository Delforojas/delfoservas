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
  classMonday:      () => `${RESERVATIONS}/clases/monday`,
  classTuesday:     () => `${RESERVATIONS}/clases/tuesday`,
  classWednesday:  () => `${RESERVATIONS}/clases/wednesday`,
  classThursday:     () => `${RESERVATIONS}/clases/thursday`,
  classFriday:    () => `${RESERVATIONS}/clases/friday`,

  reservationsByDay: (userId: number, dia: string) => `${RESERVATIONS}/usuarios/${userId}/reservas/${dia}`,
};