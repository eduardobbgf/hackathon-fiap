import { IsNotEmpty, IsUUID } from "class-validator";

// DTO de Entrada: O ID do vídeo a ser processado
export class ProcessVideoDto {
  @IsNotEmpty()
  @IsUUID()
  videoId: string;
}

// DTO de Resposta: Confirmação de que o processamento começou
export class ProcessVideoResponseDto {
  message: string;
}
