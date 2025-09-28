import { Inject, Injectable } from "@nestjs/common";
import { IUseCase, BusinessRuleViolationException } from "@app/shared";
import { IVideoRepository } from "../../../domain/repositories/video.repository.interface";
import {
  GetVideoStatusDto,
  GetVideoStatusResponseDto,
} from "./get-video-status.dto";

@Injectable()
export class GetVideoStatusUseCase
  implements IUseCase<GetVideoStatusDto, GetVideoStatusResponseDto>
{
  constructor(
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
  ) {}

  async execute(
    request: GetVideoStatusDto,
  ): Promise<GetVideoStatusResponseDto> {
    const { videoId } = request;

    // 1. Encontrar o vídeo
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new BusinessRuleViolationException("Video not found.");
    }

    // 2. Retornar a resposta com o status atual
    return {
      videoId: video.id,
      originalName: video.originalName,
      status: video.status,
      frameCount: video.frameCount,
    };
  }
}
