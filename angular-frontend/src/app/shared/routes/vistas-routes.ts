// src/app/shared/routes/vistas-routes.ts
import { API } from "../../environments/environments";

const VISTAS = `${API}/vistas`;

export const VISTAS_ROUTES = {
  // Bonos (vistas)
  bonos:              () => `${VISTAS}/vistabonos`,
  bonosByUser:        (userId: number) => `${VISTAS}/vistabonos/${userId}`,

  // Clases / Reservas por usuario
  clasesByUser:       (userId: number) => `${VISTAS}/usuarioclases/${userId}/clases`,
  reservasByUser:     (userId: number) => `${VISTAS}/usuarioreservas/${userId}/reservas`,
  walletByUser:       (userId: number) => `${VISTAS}/usuariowallet/${userId}/wallet`,
  bonosVistaByUser:   (userId: number) => `${VISTAS}/usuariobonos/${userId}/bonos`,

  // Profes/Clases
  alumnosByClase:     (claseId: number) => `${VISTAS}/claseprofe/${claseId}/clasealumnos`,
  totalAlumnosClase:  (claseId: number) => `${VISTAS}/claseprofe/${claseId}/total-alumnos`,

  // Usuario / Clases (base API fuera de /vistas)
  usuarios:           () => `${API}/users`,
  clases:             () => `${API}/clases`,

  // VISTA: usuario-wallet
  usuarioWalletAll:   () => `${VISTAS}/usuario-wallet`,
  usuarioWalletById:  (userId: number) => `${VISTAS}/usuario-wallet/${userId}`,

  // Wallet por mes / tipo
  walletMes:          (mes: string) => `${VISTAS}/wallet/mes/${encodeURIComponent(mes)}`,
  walletMeses:        () => `${VISTAS}/wallet/meses`,
  walletPorTipo:      (tipoId: number) => `${VISTAS}/wallet/tipoclase/${tipoId}`,
  walletFiltrar:      () => `${VISTAS}/wallet/filtrar`, // usa query params ?mes=&tipoclaseId=
};