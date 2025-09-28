// video.module.ts - VERSÃO CORRIGIDA
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";

// 1. IMPORTE O DATABASEMODULE
import { DatabaseModule } from "../database/database.module";

import { VideoController } from "../controllers/video.controller";
import { HealthController } from "../controllers/health.controller";
// ... outras importações ...
import {
  DownloadFramesUseCase,
  FileStorageService,
  GetVideoStatusUseCase,
  ListVideosUseCase,
  ProcessVideoUseCase,
  UploadVideoUseCase,
  UserServiceClient,
  // ...
} from "../../application";
import { VideoProcessingWorker } from "../workers/video-processing.worker";
import { NotificationService } from "../../application/services/noitications.service";
import { InMemoryQueueService } from "../../application/services/in-memory-queue.service";
import { FFmpegService } from "../../application/services/ffmpeg.service";

@Module({
  // 2. ADICIONE O DATABASEMODULE AQUI
  imports: [ConfigModule, HttpModule, DatabaseModule],

  controllers: [VideoController, HealthController],
  providers: [
    // ... todos os seus outros providers
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
      // process.env.NODE_ENV === "development"
      //   ? InMemoryQueueService
      //   : RabbitMQQueueService,
    },
    {
      provide: "INotificationService",
      useClass: NotificationService,
    },
    {
      provide: "IUserServiceClient",
      useClass: UserServiceClient,
    },
    // ...
    UploadVideoUseCase, // Agora o NestJS saberá como injetar "IVideoRepository" aqui
    ProcessVideoUseCase,
    GetVideoStatusUseCase,
    ListVideosUseCase,
    DownloadFramesUseCase,

    VideoProcessingWorker,
  ],
  exports: [],
})
export class VideoModule {}
