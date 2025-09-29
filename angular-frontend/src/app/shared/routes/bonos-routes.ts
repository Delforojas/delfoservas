import { API } from "../../environments/environments";

const BONOS = `${API}/bonos`;

export const BONOS_ROUTES = {
  list:   () => BONOS ,
  byId:   (id: number) => `${BONOS}/${id}`,
  create: () => `${BONOS}`,
  update: (id: number) => `${BONOS}/${id}`,
  delete: (id: number) => `${BONOS}/${id}`,
  //activosUser: (usuarioId: number) => `${API}/bonos/usuario/${usuarioId}/activos`,
}; 