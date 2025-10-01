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
    this.startListening();
  }

  private async startListening() {}

  public async processVideoJob(videoId: string) {
    let video: Video;
    try {
      video = await this.videoRepository.findById(videoId);
      if (!video) {
        throw new Error("Video not found.");
      }

      video.startProcessing();
      await this.videoRepository.save(video);

      const { frameCount, frameFilePaths } =
        await this.videoProcessingService.processVideo(video.filename);
    } catch (error) {
      console.error(`❌ Video processing failed for video ${videoId}:`, error);
      if (video) {
        await this.videoRepository.save(video);
      }
    }
  }
}
