import { API } from "../../environments/environments";

const CLASES = `${API}/clases`;

export const CLASES_ROUTES = {
  list:         () => CLASES,
  vista:        () => `${CLASES}/vista`,
  byId:         (id: number) => `${CLASES}/${id}`,
  create:       () => CLASES,
  update:       (id: number) => `${CLASES}/${id}`,
  delete:       (id: number) => `${CLASES}/${id}`,
  mias:         () => `${CLASES}/mias`,
  alumnosClase: (id: number) => `${CLASES}/alumnos/${id}`,
};