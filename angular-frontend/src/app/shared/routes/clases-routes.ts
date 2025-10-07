import { API } from "../../environments/environments";

const CLASES = `${API}/clases`;

export const CLASES_ROUTES = {
  list:         () => CLASES,
  vista:        () => `${CLASES}/vista`,
  create:       () => CLASES,
  delete:       (id: number) => `${CLASES}/${id}`,
  mias:         () => `${CLASES}/mias`,
  alumnosClase: (id: number) => `${CLASES}/alumnos/${id}`,
};