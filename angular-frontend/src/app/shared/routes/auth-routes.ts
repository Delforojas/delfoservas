// src/app/shared/routes/auth-routes.ts
import { API } from "../../environments/environments";



export const AUTH_ROUTES = {
  login:    () => `${API}/login`,
  register: () => `${API}/users/register`,
  me:       () => `${API}/users/me`,       
  forgot:   () => `${API}/password/forgot`, 
  reset:    () => `${API}/password/reset`,  
};