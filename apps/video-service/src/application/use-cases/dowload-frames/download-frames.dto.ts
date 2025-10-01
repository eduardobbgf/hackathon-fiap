import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class DownloadFramesDto {
  @ApiProperty({
    description: "ID do vídeo cujos frames serão baixados.",
    example: "c1d2e3f4-g5h6-7890-1234-567890abcdef",
  })
  @IsNotEmpty()
  @IsUUID()
  videoId: string;
}

export class DownloadFramesResponseDto {
  @ApiProperty({
    description: "O caminho local para o arquivo ZIP gerado.",
    example: "/tmp/frames-a1b2c3d4.zip",
  })
  zipUrl: string;

  @ApiProperty({
    description: "O nome original do vídeo, usado para nomear o arquivo ZIP.",
    example: "video_casamento.mp4",
  })
  originalName: string;

  @ApiProperty({
    description: "A quantidade de frames contidos no arquivo ZIP.",
    example: 3500,
  })
  frameCount: number;
}
