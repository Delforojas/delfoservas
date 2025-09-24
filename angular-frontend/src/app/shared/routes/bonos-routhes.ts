import { environment } from "../../environments/environments";

export const BONOS_API_URL = `${environment.endpointUrl}/bonos`;

export const BONOS_ROUTES = {
  list:        () => `${BONOS_API_URL}`,
  byId:        (id: number) => `${BONOS_API_URL}/${id}`,
  create:      () => `${BONOS_API_URL}/create`,
  update:      (id: number) => `${BONOS_API_URL}/update/${id}`,
  delete:      (id: number) => `${BONOS_API_URL}/delete/${id}`,
  activosUser: (usuarioId: number) => `${BONOS_API_URL}/usuario/${usuarioId}/bono-activo`,
};