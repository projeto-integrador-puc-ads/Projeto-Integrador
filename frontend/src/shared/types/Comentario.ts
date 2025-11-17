// Importa o UsuarioDTO que você já tem
// Importa o UsuarioDTO que você já tem
import type { UsuarioDTO } from './usuario';

export interface Comentario {
  id: number;
  texto: string;
  dataComentario: string;
  usuario: UsuarioDTO; // <- Usa o DTO existente
}