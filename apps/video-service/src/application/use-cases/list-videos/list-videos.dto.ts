import { IsNotEmpty, IsUUID } from "class-validator";

// DTO de Entrada: O ID do usuário para listar vídeos
export class ListVideosDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

// DTO de Resposta: Um array de objetos de vídeo para a lista
export class ListVideosResponseDto {
  id: string;
  originalName: string;
  status: string;
  createdAt: Date;
}
