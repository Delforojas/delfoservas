export interface Usuario {
  id: number;
  nombre: string | null;
  email: string;
  roles?: string[];
  password?: string;
  avatar?: string | null;
}