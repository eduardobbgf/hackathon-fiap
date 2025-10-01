import { Frame, Video } from "..";
import { FrameEntity } from "../../infrastructure/database/entity/frame.entity";
import { VideoEntity } from "../../infrastructure/database/entity/video.entity";

export interface IVideoRepository {
  findById(id: string): Promise<Video | null>;
  save(video: Video): Promise<Partial<VideoEntity>>;
  update(video: Video): Promise<Video>;
  delete(id: string): Promise<void>;
  findByUserId(userId: string): Promise<Video[]>;
  getFramesByVideoId(videoId: string): Promise<Frame[]>;
}

export const IVideoRepository = Symbol("IVideoRepository");
