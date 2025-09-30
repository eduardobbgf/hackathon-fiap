// apps/video-service/src/application/use-cases/process-video.use-case.ts

import { Inject, Injectable, Scope } from "@nestjs/common";
import { IVideoProcessingService } from "../../ports/video-processing.service.interface";
import { IFileStorageService } from "../../ports/file-storage.service.interface";
import { IVideoRepository } from "apps/video-service/src/domain";
import { INotificationService } from "../../ports/notification.service.interface";
import { IUserServiceClient } from "../../ports/user-service-client.interface";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class ProcessVideoUseCase {
  constructor(
    @Inject("IVideoProcessingService")
    private readonly videoProcessingService: IVideoProcessingService,

    @Inject("IFileStorageService")
    private readonly fileStorage: IFileStorageService,

    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
    @Inject("INotificationService")
    private readonly notificationService: INotificationService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async execute(request: { videoId: string }): Promise<void> {
    const { videoId } = request;

    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error(`Vídeo com ID ${videoId} não encontrado.`);
    }

    const videoFilePath = this.fileStorage.getFilePath(video.filename);

    try {
      video.startProcessing();
      await this.videoRepository.update(video);
      const { frameCount, frameFilePaths } =
        await this.videoProcessingService.processVideo(videoFilePath);

      if (frameCount === 0) {
        throw new Error(
          "Nenhum frame foi extraído do vídeo. O processamento não pode continuar.",
        );
      }

      const zipFilePath = await this.fileStorage.createZipFile(frameFilePaths);

      await this.fileStorage.deleteFiles(frameFilePaths);

      const zipFilename = this.fileStorage.getFilename(zipFilePath); // Método para extrair apenas o nome do arquivo
      video.completeProcessing(frameCount, zipFilename);

      const response =
        await this.notificationService.sendVideoProcessingCompleted(
          video.userEmail,
          video.originalName,
        );
      await this.videoRepository.update(video);
    } catch (error) {
      console.error(
        `[ProcessVideoUseCase] Falha CRÍTICA ao processar o vídeo ${videoId}.`,
        error,
      );

      // 6. Em caso de erro em qualquer etapa, marcar como 'FAILED'
      video.failProcessing();
      await this.videoRepository.update(video);

      // Re-lança o erro para que o worker possa logá-lo
      throw error;
    }
  }
}
