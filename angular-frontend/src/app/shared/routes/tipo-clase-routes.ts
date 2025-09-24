import { environment } from "../../environments/environments";

export const API_URL = environment.endpointUrl;

export const TIPO_CLASE_ROUTES = {
  list:     () => `${API_URL}/tipoclase`,
  byId:     (id: number) => `${API_URL}/tipoclase/${id}`,
  create:   () => `${API_URL}/tipoclase/create`,
  update:   (id: number) => `${API_URL}/tipoclase/update/${id}`,
  delete:   (id: number) => `${API_URL}/tipoclase/delete/${id}`,
};