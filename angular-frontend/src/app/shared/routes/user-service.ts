import { environment } from "../../environments/environments";

export const API_URL = environment.endpointUrl;

export const USERS_ROUTES = {
  list:        () => `${API_URL}/users`,
  byId:        (id: number) => `${API_URL}/users/${id}`,
  update:      (id: number) => `${API_URL}/users/${id}`,
  delete:      (id: number) => `${API_URL}/users/${id}`,
  profesores:  () => `${API_URL}/users/profesores`,
};