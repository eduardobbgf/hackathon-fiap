import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import {
  UploadVideoDto,
  UploadVideoResponseDto,
} from "../../application/use-cases/upload-video/upload-video.dto";
import { ListVideosResponseDto } from "../../application/use-cases/list-videos/list-videos.dto";

import { UploadVideoUseCase } from "../../application/use-cases/upload-video/upload-video.use-case";
import { GetVideoStatusUseCase } from "../../application/use-cases/get-video-status/get-video-status.use-case";
import { ListVideosUseCase } from "../../application/use-cases/list-videos/list-videos.use-case";

import {
  DownloadFramesUseCase,
  GetVideoStatusResponseDto,
} from "../../application";
import { JwtAuthGuard } from "@app/auth-lib";

@ApiTags("Videos")
@ApiBearerAuth()
@Controller("videos")
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(
    private readonly uploadVideoUseCase: UploadVideoUseCase,
    private readonly getVideoStatusUseCase: GetVideoStatusUseCase,
    private readonly listVideosUseCase: ListVideosUseCase,
    private readonly downloadFramesUseCase: DownloadFramesUseCase,
  ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Faz o upload de um novo vídeo para processamento" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Arquivo de vídeo e dados do usuário",
    type: UploadVideoDto,
  })
  @ApiResponse({
    status: 201,
    description: "Upload bem-sucedido",
    type: UploadVideoResponseDto,
  })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadVideoDto,
  ): Promise<UploadVideoResponseDto> {
    const request = { file, userId: body.userId, userEmail: body.userEmail };
    return this.uploadVideoUseCase.execute(request);
  }

  @Get()
  @ApiOperation({ summary: "Lista todos os vídeos de um usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de vídeos retornada com sucesso",
    type: [ListVideosResponseDto],
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  async listVideos(
    @Body() body: { userId: string },
  ): Promise<ListVideosResponseDto[]> {
    return this.listVideosUseCase.execute({ userId: body.userId });
  }

  @Get(":videoId/status")
  @ApiOperation({ summary: "Verifica o status de processamento de um vídeo" })
  @ApiResponse({
    status: 200,
    description: "Status do vídeo",
    type: GetVideoStatusResponseDto,
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Vídeo não encontrado" })
  async getVideoStatus(
    @Param("videoId") videoId: string,
  ): Promise<GetVideoStatusResponseDto> {
    return this.getVideoStatusUseCase.execute({ videoId });
  }

  @Get(":videoId/download")
  @ApiOperation({
    summary: "Baixa os frames extraídos de um vídeo em um arquivo ZIP",
  })
  @ApiResponse({
    status: 200,
    description: "Arquivo ZIP com os frames do vídeo.",
    content: {
      "application/zip": { schema: { type: "string", format: "binary" } },
    },
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 404, description: "Vídeo ou frames não encontrados." })
  async downloadFrames(
    @Param("videoId") videoId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { zipUrl, originalName } = await this.downloadFramesUseCase.execute({
      videoId,
    });
    res.download(zipUrl, `${originalName}-frames.zip`);
  }
}
