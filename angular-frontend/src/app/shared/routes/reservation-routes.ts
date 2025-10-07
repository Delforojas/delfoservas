import { API } from "../../environments/environments";

const RESERVATIONS = `${API}/reservations`;

export const RESERVATION_ROUTES = {

  delete:           (id: number) => `${RESERVATIONS}/${id}`,
  reservarClase:    (claseId: number) => `${RESERVATIONS}/reservar/${claseId}`,
  classMonday:      () => `${RESERVATIONS}/clases/monday`,
  classTuesday:     () => `${RESERVATIONS}/clases/tuesday`,
  classWednesday:  () => `${RESERVATIONS}/clases/wednesday`,
  classThursday:     () => `${RESERVATIONS}/clases/thursday`,
  classFriday:    () => `${RESERVATIONS}/clases/friday`,
  reservationsByDay: (userId: number, dia: string) => `${RESERVATIONS}/usuarios/${userId}/reservas/${dia}`,
};