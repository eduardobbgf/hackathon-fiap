import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

// DTOs
import {
  UploadVideoDto,
  UploadVideoResponseDto,
} from "../../application/use-cases/upload-video/upload-video.dto";
import { ListVideosResponseDto } from "../../application/use-cases/list-videos/list-videos.dto";

// Casos de Uso
import { UploadVideoUseCase } from "../../application/use-cases/upload-video/upload-video.use-case";
import { GetVideoStatusUseCase } from "../../application/use-cases/get-video-status/get-video-status.use-case";
import { ListVideosUseCase } from "../../application/use-cases/list-videos/list-videos.use-case";

// Guards
import { AuthGuard } from "@nestjs/passport"; // Assumindo que você usa o AuthGuard do Passport
import {
  DownloadFramesUseCase,
  GetVideoStatusResponseDto,
} from "../../application";
import { JwtAuthGuard } from "@app/auth-lib";

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
  @UseInterceptors(FileInterceptor("file")) // 'file' é o nome do campo no formulário
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadVideoDto,
  ): Promise<UploadVideoResponseDto> {
    const request = {
      file, // o objeto de arquivo
      userId: body.userId,
    };

    return this.uploadVideoUseCase.execute(request);
  }

  @Get()
  async listVideos(
    @Body() body: { userId: string },
  ): Promise<ListVideosResponseDto[]> {
    return this.listVideosUseCase.execute({ userId: body.userId });
  }

  @Get(":videoId/status")
  async getVideoStatus(
    @Param("videoId") videoId: string,
  ): Promise<GetVideoStatusResponseDto> {
    return this.getVideoStatusUseCase.execute({ videoId });
  }

  @Get(":videoId/download")
  async downloadFrames(
    @Param("videoId") videoId: string,
    @Res() res: Response,
  ): Promise<void> {
    const { zipUrl, originalName } = await this.downloadFramesUseCase.execute({
      videoId,
    });

    // Envia o arquivo ZIP como resposta
    res.download(zipUrl, `${originalName}-frames.zip`);
  }
}
