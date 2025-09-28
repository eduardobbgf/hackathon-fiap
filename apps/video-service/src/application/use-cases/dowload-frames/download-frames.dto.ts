import { IsNotEmpty, IsUUID } from "class-validator";

// DTO de Entrada: O ID do vídeo para download dos frames
export class DownloadFramesDto {
  @IsNotEmpty()
  @IsUUID()
  videoId: string;
}

// DTO de Resposta: O URL para o arquivo .zip
export class DownloadFramesResponseDto {
  zipUrl: string;
  originalName: string;
  frameCount: number;
}
