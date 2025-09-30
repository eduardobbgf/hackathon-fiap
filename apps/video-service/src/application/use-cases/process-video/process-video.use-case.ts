// apps/video-service/src/application/use-cases/process-video.use-case.ts

import { Inject, Injectable } from "@nestjs/common";
import { IVideoProcessingService } from "../../ports/video-processing.service.interface";
import { IFileStorageService } from "../../ports/file-storage.service.interface";
import { IVideoRepository } from "apps/video-service/src/domain";

@Injectable()
export class ProcessVideoUseCase {
  constructor(
    @Inject("IVideoProcessingService")
    private readonly videoProcessingService: IVideoProcessingService,

    @Inject("IFileStorageService")
    private readonly fileStorage: IFileStorageService,

    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute(request: { videoId: string }): Promise<void> {
    const { videoId } = request;

    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new Error(`Vídeo com ID ${videoId} não encontrado.`);
    }

    // Usaremos o caminho do vídeo original salvo no storage
    const videoFilePath = this.fileStorage.getFilePath(video.filename);

    try {
      // 1. Mudar o status para 'PROCESSING'
      video.startProcessing();
      await this.videoRepository.update(video);
      const { frameCount, frameFilePaths } =
        await this.videoProcessingService.processVideo(videoFilePath);

      if (frameCount === 0) {
        // Se nenhum frame foi gerado, não há o que zipar. Consideramos uma falha.
        throw new Error(
          "Nenhum frame foi extraído do vídeo. O processamento não pode continuar.",
        );
      }

      // 3. Chamar o FileStorageService para criar o arquivo ZIP
      const zipFilePath = await this.fileStorage.createZipFile(frameFilePaths);

      await this.fileStorage.deleteFiles(frameFilePaths);

      const zipFilename = this.fileStorage.getFilename(zipFilePath); // Método para extrair apenas o nome do arquivo
      video.completeProcessing(frameCount, zipFilename);
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
