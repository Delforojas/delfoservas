import { environment } from "../../environments/environments";

const API = environment.endpointUrl;
const WALLET = `${API}/wallet`;

export const WALLET_ROUTES = {
  all:     () => WALLET,                  // GET /api/wallet
  byId:    (id: number) => `${WALLET}/${id}`, // GET /api/wallet/{id}
  create:  () => `${WALLET}/create`,      // POST /api/wallet/create
  delete:  (id: number) => `${WALLET}/delete/${id}`, // DELETE /api/wallet/delete/{id}
};