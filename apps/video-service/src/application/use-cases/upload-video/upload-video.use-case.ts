import { Inject, Injectable } from "@nestjs/common";
import { BusinessRuleViolationException, IUseCase } from "@app/shared"; // Assumindo uma interface IUseCase
import { UploadVideoDto, UploadVideoResponseDto } from "./upload-video.dto";
import { IVideoRepository } from "../../../domain/repositories/video.repository.interface";
import { v4 as uuidv4 } from "uuid";
import { IFileStorageService } from "../../ports/file-storage.service.interface";
import { Video } from "apps/video-service/src/domain";
import { IUserServiceClient } from "../../ports/user-service-client.interface";
import { UUID } from "crypto";

export interface UploadVideoRequest {
  file: Express.Multer.File;
  userId: string;
  token: string;
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
    @Inject("IUserServiceClient") // A nova dependência
    private readonly userServiceClient: IUserServiceClient,
  ) {}

  async execute(request: UploadVideoRequest): Promise<UploadVideoResponseDto> {
    const { file, userId, token } = request;

    // 1. Validação de negócio: verificar se o usuário existe
    const user = await this.userServiceClient.findUserById(userId, token);
    if (!user) {
      throw new BusinessRuleViolationException("User not found.");
    }
    const filename = `${uuidv4()}-${file.originalname}`;

    // 1. Armazenar o arquivo
    const filePath = await this.fileStorageService.upload(file, filename);

    // 2. Criar a entidade de domínio
    const newVideo = Video.create({
      id: uuidv4(),
      filename: filePath,
      originalName: file.originalname,
      size: file.size,
      userId: userId,
    });

    // 3. Persistir a entidade
    const savedVideo = await this.videoRepository.save(newVideo);

    // 4. Retornar a resposta
    return {
      id: savedVideo.id,
      originalName: savedVideo.originalName,
      status: savedVideo.status,
      createdAt: savedVideo.createdAt,
    };
  }
}
