export interface Usuario {
  id: number;
  nombre: string | null;
  email: string;
  roles?: string[];
  password?: string;
  profile_image: string | null;
}