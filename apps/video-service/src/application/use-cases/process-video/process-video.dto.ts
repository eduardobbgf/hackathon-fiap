import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class ProcessVideoDto {
  @ApiProperty({
    description: "O ID único do vídeo.",
    example: "f1g2h3i4-j5k6-7890-1234-567890abcdef",
  })
  @IsNotEmpty()
  @IsUUID()
  videoId: string;
}

export class ProcessVideoResponseDto {
  message: string;
}
