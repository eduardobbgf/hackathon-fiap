import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

import { DatabaseModule } from "../database/database.module";

import { VideoController } from "../controllers/video.controller";
import { HealthController } from "../controllers/health.controller";
import {
  DownloadFramesUseCase,
  FileStorageService,
  GetVideoStatusUseCase,
  ListVideosUseCase,
  ProcessVideoUseCase,
  UploadVideoUseCase,
  UserServiceClient,
} from "../../application";
import { VideoProcessingWorker } from "../workers/video-processing.worker";
import { NotificationService } from "../../application/services/noitications.service";
import { InMemoryQueueService } from "../../application/services/in-memory-queue.service";
import { FFmpegService } from "../../application/services/ffmpeg.service";
import { QueueService } from "../../application/services/rabbitmq-queue.service";
import { VideoWorkerController } from "../controllers/video-worker.controller";

@Module({
  imports: [ConfigModule, HttpModule, DatabaseModule],

  controllers: [VideoController, HealthController, VideoWorkerController],
  providers: [
    {
      provide: "IFileStorageService",
      useClass: FileStorageService,
    },

    {
      provide: "IVideoProcessingService",
      useClass: FFmpegService,
    },
    {
      provide: "IQueueService",
      useClass: InMemoryQueueService,
    },
    {
      provide: "INotificationService",
      useClass: NotificationService,
    },
    {
      provide: "IUserServiceClient",
      useClass: UserServiceClient,
    },
    UploadVideoUseCase,
    ProcessVideoUseCase,
    GetVideoStatusUseCase,
    ListVideosUseCase,
    DownloadFramesUseCase,
    QueueService,
    VideoProcessingWorker,
  ],
  exports: [QueueService],
})
export class VideoModule {}
