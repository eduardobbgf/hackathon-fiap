// DatabaseModule - Versão Corrigida e Simplificada
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./entity/video.entity";
import { FrameEntity } from "./entity/frame.entity";
import { VideoEntityRepository } from "./repositories/video.repository";

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, FrameEntity])],
  providers: [
    VideoEntityRepository,
    {
      provide: "IVideoRepository",
      useExisting: VideoEntityRepository,
    },
  ],
  exports: ["IVideoRepository"],
})
export class DatabaseModule {}
