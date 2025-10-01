import { Inject, Injectable } from "@nestjs/common";
import { IUseCase, BusinessRuleViolationException } from "@app/shared";
import { IVideoRepository } from "../../../domain/repositories/video.repository.interface";
import {
  DownloadFramesDto,
  DownloadFramesResponseDto,
} from "./download-frames.dto";
import { IFileStorageService } from "../../ports/file-storage.service.interface";
import { VideoStatus } from "apps/video-service/src/domain";

@Injectable()
export class DownloadFramesUseCase
  implements IUseCase<DownloadFramesDto, DownloadFramesResponseDto>
{
  constructor(
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
    @Inject("IFileStorageService")
    private readonly fileStorageService: IFileStorageService,
  ) {}

  async execute(
    request: DownloadFramesDto,
  ): Promise<DownloadFramesResponseDto> {
    const { videoId } = request;

    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new BusinessRuleViolationException("Video not found.");
    }

    const videoStatus = new VideoStatus(video.status);
    if (!videoStatus.equals(VideoStatus.COMPLETED())) {
      throw new BusinessRuleViolationException(
        "Video is not in a completed state. Cannot download frames.",
      );
    }

    const frames = await this.videoRepository.getFramesByVideoId(videoId);
    if (frames.length === 0) {
      throw new BusinessRuleViolationException(
        "No frames found for this video.",
      );
    }

    const filePaths = frames.map((frame) => frame.path);
    const zipFilePath = await this.fileStorageService.createZipFile(filePaths);

    return {
      zipUrl: zipFilePath,
      originalName: video.originalName,
      frameCount: video.frameCount,
    };
  }
}
