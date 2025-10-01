import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetVideoStatusDto {
  @ApiProperty({
    description: "ID do vídeo que terá o status consultado.",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @IsNotEmpty()
  @IsUUID()
  videoId: string;
}

export class GetVideoStatusResponseDto {
  @ApiProperty({
    description: "O ID único do vídeo.",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  videoId: string;

  @ApiProperty({
    description: "O nome original do arquivo de vídeo.",
    example: "evento_de_familia.mov",
  })
  originalName: string;

  @ApiProperty({
    description: "O status atual do processamento do vídeo.",
    example: "PROCESSING",
  })
  status: string;

  @ApiProperty({
    description:
      "A contagem de frames extraídos do vídeo após o processamento.",
    example: 1250,
  })
  frameCount: number;
}
