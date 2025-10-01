import { Inject, Injectable } from "@nestjs/common";
import { IUseCase } from "@app/shared";
import { IVideoRepository } from "../../../domain/repositories/video.repository.interface";
import { ListVideosDto, ListVideosResponseDto } from "./list-videos.dto";

@Injectable()
export class ListVideosUseCase
  implements IUseCase<ListVideosDto, ListVideosResponseDto[]>
{
  constructor(
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute(request: ListVideosDto): Promise<ListVideosResponseDto[]> {
    const videos = await this.videoRepository.findByUserId(request.userId);

    return videos.map((video) => ({
      id: video.id,
      originalName: video.originalName,
      status: video.status,
      createdAt: video.createdAt,
    }));
  }
}
