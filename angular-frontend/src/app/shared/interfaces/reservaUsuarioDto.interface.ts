export interface ReservaUsuarioDto {
  id_usuario: number;
  usuario_nombre: string;
  reserva_id: number;
  clase_id: number;
  bono_id: number | null;
  clase_nombre: string;
  fecha: string; 
  hora: string; 
  tipoclase_nombre: string;
  bono_estado: 'activo' | 'consumido' | string; 
  avatar?: string | null;
}