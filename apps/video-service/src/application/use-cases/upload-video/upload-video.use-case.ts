import { Inject, Injectable } from "@nestjs/common";
import { BusinessRuleViolationException, IUseCase } from "@app/shared";
import { UploadVideoDto, UploadVideoResponseDto } from "./upload-video.dto";
import { IVideoRepository } from "../../../domain/repositories/video.repository.interface";
import { v4 as uuidv4 } from "uuid";
import { IFileStorageService } from "../../ports/file-storage.service.interface";
import { Video } from "apps/video-service/src/domain";
import { IUserServiceClient } from "../../ports/user-service-client.interface";
import { UUID } from "crypto";
import { QueueService } from "../../services/rabbitmq-queue.service";

export interface UploadVideoRequest {
  file: Express.Multer.File;
  userId: string;
  userEmail: string;
}

@Injectable()
export class UploadVideoUseCase
  implements IUseCase<UploadVideoRequest, UploadVideoResponseDto>
{
  constructor(
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
    @Inject("IFileStorageService")
    private readonly fileStorageService: IFileStorageService,
    @Inject("IUserServiceClient")
    private readonly userServiceClient: IUserServiceClient,
    private readonly queueService: QueueService,
  ) {}

  async execute(request: UploadVideoRequest): Promise<UploadVideoResponseDto> {
    const { file, userId, userEmail } = request;

    const filename = `${uuidv4()}-${file.originalname}`;

    const filePath = await this.fileStorageService.upload(file, filename);
    console.log(userEmail);

    const newVideo = Video.create({
      id: uuidv4(),
      filename: filePath,
      originalName: file.originalname,
      size: file.size,
      userId: userId,
      userEmail: userEmail,
    });
    const savedVideo = await this.videoRepository.save(newVideo);
    this.queueService.addVideoToQueue(savedVideo.id);

    return {
      id: savedVideo.id,
      originalName: savedVideo.originalName,
      status: savedVideo.status,
      createdAt: savedVideo.createdAt,
    };
  }
}
