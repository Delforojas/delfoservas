import { API } from "../../environments/environments";

const ROOM = `${API}/room`;

export const ROOM_ROUTES = {
  list:      () => ROOM,
  byId:      (id: number) => `${ROOM}/${id}`,
  create:    () => `${ROOM}`,
  update:    (id: number) => `${ROOM}/${id}`,
  delete:    (id: number) => `${ROOM}/${id}`,
};