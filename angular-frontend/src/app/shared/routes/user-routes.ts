import { API } from "../../environments/environments";

const USERS = `${API}/users`;

export const USERS_ROUTES = {
  list:       () => USERS,                 
  create:     () => USERS,                 
  byId:       (id: number) => `${USERS}/${id}`, 
  update:     (id: number) => `${USERS}/${id}`, 
  delete:     (id: number) => `${USERS}/${id}`, 
  profesores: () => `${USERS}/profesores`,
};
