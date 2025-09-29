import { API } from "../../environments/environments";

const WALLET = `${API}/vistas`;

export const WALLET_ROUTES = {
  all:    () => WALLET,                  // GET    /api/wallet
  byId:   (id: number) => `${WALLET}/${id}`, // GET    /api/wallet/:id
  create: () => WALLET ,                  // POST   /api/wallet
  delete: (id: number) => `${WALLET}/${id}`, // DELETE /api/wallet/:id
};