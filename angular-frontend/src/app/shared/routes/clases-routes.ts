import { environment } from "../../environments/environments";

export const CLASES_API_URL = `${environment.endpointUrl}/clases`;

export const CLASES_ROUTES = {
  list:         () => `${CLASES_API_URL}`,
  vista:        () => `${CLASES_API_URL}/vista`,
  byId:         (id: number) => `${CLASES_API_URL}/${id}`,
  create:       () => `${CLASES_API_URL}/create`,
  update:       (id: number) => `${CLASES_API_URL}/update/${id}`,
  delete:       (id: number) => `${CLASES_API_URL}/delete/${id}`,
  mias:         () => `${CLASES_API_URL}/mias`,
  alumnosClase: (id: number) => `${CLASES_API_URL}/alumnos/${id}`,
};