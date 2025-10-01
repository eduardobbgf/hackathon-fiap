import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UploadVideoDto {
  @ApiProperty({
    type: "string",
    format: "binary",
    description: "Arquivo de vídeo a ser enviado.",
    required: true,
  })
  file: any;

  @ApiProperty({
    description: "ID do usuário que está enviando o vídeo.",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: "E-mail do usuário para notificações.",
    example: "usuario@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;
}

export class UploadVideoResponseDto {
  @ApiProperty({
    description: "O ID único gerado para o vídeo.",
    example: "b1c2d3e4-f5g6-7890-1234-567890abcdef",
  })
  id: string;

  @ApiProperty({
    description: "O nome original do arquivo enviado.",
    example: "meu_video_de_ferias.mp4",
  })
  originalName: string;

  @ApiProperty({
    description: "O status inicial do vídeo após o upload.",
    example: "UPLOADED",
  })
  status: string;

  @ApiProperty({
    description: "A data e hora em que o upload foi realizado.",
  })
  createdAt: Date;
}
