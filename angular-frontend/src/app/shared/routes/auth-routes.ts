// src/app/shared/routes/auth-routes.ts
import { environment } from "../../environments/environments";

export const AUTH_API_URL = environment.endpointUrl;

export const AUTH_ROUTES = {
  login:    () => `${AUTH_API_URL}/login`,
  register: () => `${AUTH_API_URL}/users/register`,
  me:       () => `${AUTH_API_URL}/users/me`,
  logout:   () => `${AUTH_API_URL}/logout`,          // si backend tiene endpoint
  forgot:   () => `${AUTH_API_URL}/password/forgot`, // si lo implementas en Symfony
  reset:    () => `${AUTH_API_URL}/password/reset`,  // idem
};