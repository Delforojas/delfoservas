import { environment } from "../../environments/environments";

environment

export const API_URL = environment.endpointUrl;

export const ROOM_ROUTES = {
  list:      () => `${API_URL}/room`,
  byId:      (id: number) => `${API_URL}/room/${id}`,
  create:    () => `${API_URL}/room/create`,
  update:    (id: number) => `${API_URL}/room/update/${id}`,
  delete:    (id: number) => `${API_URL}/room/delete/${id}`,
};