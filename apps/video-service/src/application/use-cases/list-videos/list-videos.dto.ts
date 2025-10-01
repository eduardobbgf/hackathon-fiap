import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class ListVideosDto {
  @ApiProperty({
    description: "ID do usuário cujos vídeos serão listados.",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class ListVideosResponseDto {
  @ApiProperty({
    description: "O ID único do vídeo.",
    example: "f1g2h3i4-j5k6-7890-1234-567890abcdef",
  })
  id: string;

  @ApiProperty({
    description: "O nome original do arquivo de vídeo.",
    example: "minhas_ferias_na_praia.mp4",
  })
  originalName: string;

  @ApiProperty({
    description: "O status atual do processamento do vídeo.",
    example: "COMPLETED",
  })
  status: string;

  @ApiProperty({
    description: "A data e hora em que o vídeo foi enviado.",
  })
  createdAt: Date;
}
