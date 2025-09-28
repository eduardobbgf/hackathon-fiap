import { IsNotEmpty, IsUUID } from 'class-validator';

// DTO de Entrada: O ID do vídeo para consulta de status
export class GetVideoStatusDto {
  @IsNotEmpty()
  @IsUUID()
  videoId: string;
}

// DTO de Resposta: Informações sobre o estado atual do vídeo
export class GetVideoStatusResponseDto {
  videoId: string;
  originalName: string;
  status: string;
  frameCount: number;
}