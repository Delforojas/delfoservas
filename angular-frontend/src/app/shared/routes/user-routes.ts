import { API } from "../../environments/environments";

const USERS = `${API}/users`;

export const USERS_ROUTES = {
  list:       () => USERS,                 
  register:    () => `${USERS}/register`,      
  byId:       (id: number) => `${USERS}/${id}`, 
  update:     (id: number) => `${USERS}/${id}`, 
  delete:     (id: number) => `${USERS}/${id}`, 
  profesores: () => `${USERS}/profesores`,
 
};
