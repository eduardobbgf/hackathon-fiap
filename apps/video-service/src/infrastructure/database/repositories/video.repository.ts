// src/infrastructure/database/repositories/video.repository.ts

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Frame,
  IVideoRepository,
  Video,
  VideoStatus,
} from "apps/video-service/src/domain";
import { Repository } from "typeorm";
import { VideoEntity } from "../entity/video.entity";
import { FrameEntity } from "../entity/frame.entity";

@Injectable()
export class VideoEntityRepository implements IVideoRepository {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoOrmRepository: Repository<VideoEntity>,
    @InjectRepository(FrameEntity)
    private readonly frameOrmRepository: Repository<FrameEntity>,
  ) {}

  async findById(id: string): Promise<Video | null> {
    const entity = await this.videoOrmRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(video: Video): Promise<Video> {
    const entity = this.toEntity(video);
    const savedEntity = await this.videoOrmRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  // 🔄 Método UPDATE adicionado
  async update(video: Video): Promise<Video> {
    const entity = this.toEntity(video);
    // O TypeORM usa 'save' tanto para insert (se não houver ID) quanto para update (se houver ID)
    const updatedEntity = await this.videoOrmRepository.save(entity);
    return this.toDomain(updatedEntity);
  }

  // 🗑️ Método DELETE adicionado
  async delete(id: string): Promise<void> {
    await this.videoOrmRepository.delete(id);
  }

  async findByUserId(userId: string): Promise<Video[]> {
    const entities = await this.videoOrmRepository.find({ where: { userId } });
    return entities.map((entity) => this.toDomain(entity));
  }

  async getFramesByVideoId(videoId: string): Promise<Frame[]> {
    const entities = await this.frameOrmRepository.find({ where: { videoId } });
    return entities.map((entity) => this.toDomainFrame(entity));
  }

  private toDomain(entity: VideoEntity): Video {
    return new Video(
      entity.id,
      entity.filename,
      entity.originalName,
      entity.size,
      VideoStatus.fromValue(entity.status), // Converte a string do DB para VO
      entity.frameCount,
      entity.userId,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toEntity(video: Video): Partial<VideoEntity> {
    return {
      id: video.id,
      filename: video.filename,
      originalName: video.originalName,
      size: video.size,
      status: video.status, // Converte o VO para string do DB
      frameCount: video.frameCount,
      userId: video.userId,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
    };
  }

  private toDomainFrame(entity: FrameEntity): Frame {
    return new Frame(
      entity.id,
      entity.videoId,
      entity.frameNumber,
      entity.filename,
      entity.path,
      entity.createdAt,
    );
  }
}
