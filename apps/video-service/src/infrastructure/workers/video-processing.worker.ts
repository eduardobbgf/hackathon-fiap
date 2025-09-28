import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { IVideoRepository } from "../../domain/repositories/video.repository.interface";
import { IVideoProcessingService } from "../../application/ports/video-processing.service.interface";
import { INotificationService } from "../../application/ports/notification.service.interface";
import { IQueueService } from "../../application";
import { Frame, Video } from "../../domain";

@Injectable()
export class VideoProcessingWorker implements OnModuleInit {
  private readonly queueName = "video-processing-queue";

  constructor(
    @Inject("IQueueService")
    private readonly queueService: IQueueService,
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
    @Inject("IVideoProcessingService")
    private readonly videoProcessingService: IVideoProcessingService,
    @Inject("INotificationService")
    private readonly notificationService: INotificationService,
  ) {}

  onModuleInit() {
    // Inicia o worker assim que o módulo é inicializado
    this.startListening();
  }

  private async startListening() {
    console.log(
      `🎬 VideoProcessingWorker is listening to queue "${this.queueName}"...`,
    );
  }

  public async processVideoJob(videoId: string) {
    let video: Video;
    try {
      video = await this.videoRepository.findById(videoId);
      if (!video) {
        throw new Error("Video not found.");
      }

      // ⚙️ Use o método de domínio para iniciar o processamento
      video.startProcessing();
      await this.videoRepository.save(video);
      console.log(`Starting processing for video: ${video.originalName}`);

      // ... sua lógica de processamento
      const { frameCount, frameFilePaths } =
        await this.videoProcessingService.processVideo(video.filename);

      // ✅ Use o método de domínio para marcar como completo
      video.markAsCompleted(frameCount);
      console.log(
        `Video processing completed for video: ${video.originalName}`,
      );
    } catch (error) {
      console.error(`❌ Video processing failed for video ${videoId}:`, error);
      if (video) {
        // ❌ Use o método de domínio para marcar como erro
        video.markAsFailed();
        await this.videoRepository.save(video);
      }
    }
  }
}
