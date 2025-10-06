import { API } from "../../environments/environments";

const VISTAS = `${API}/vistas`;

export const VISTAS_ROUTES = {

  bonosByUser:        (userId: number) => `${VISTAS}/vistabonos/${userId}`,
  reservasByUser:     (userId: number) => `${VISTAS}/usuarioreservas/${userId}/reservas`,
  usuarioWalletById:  (userId: number) => `${VISTAS}/usuario-wallet/${userId}`,

};