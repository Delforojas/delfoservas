import { API} from "../../environments/environments";

export const TIPO_CLASE_ROUTES = {
  list:     () => `${API}/tipoclase`,
  byId:     (id: number) => `${API}/tipoclase/${id}`,
  create:   () => `${API}/tipoclase`,
  update:   (id: number) => `${API}/tipoclase/${id}`,
  delete:   (id: number) => `${API}/tipoclase/${id}`,
};