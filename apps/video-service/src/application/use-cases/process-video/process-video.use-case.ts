import { Inject, Injectable } from "@nestjs/common";
import { IUseCase, BusinessRuleViolationException } from "@app/shared";
import { IVideoRepository } from "../../../domain/repositories/video.repository.interface";
import { IQueueService } from "../../ports/queue.service.interface";
import { ProcessVideoDto, ProcessVideoResponseDto } from "./process-video.dto";

@Injectable()
export class ProcessVideoUseCase
  implements IUseCase<ProcessVideoDto, ProcessVideoResponseDto>
{
  constructor(
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
    @Inject("IQueueService")
    private readonly queueService: IQueueService,
  ) {}

  async execute(request: ProcessVideoDto): Promise<ProcessVideoResponseDto> {
    const { videoId } = request;

    // 1. Encontrar o vídeo e verificar seu estado
    const video = await this.videoRepository.findById(videoId);
    if (!video) {
      throw new BusinessRuleViolationException("Video not found.");
    }

    // 2. Tente iniciar o processamento usando o método de domínio
    // O próprio método startProcessing() conterá a lógica de validação
    // para garantir que o status é o correto para iniciar o processamento.
    try {
      video.startProcessing();
    } catch (error) {
      throw new BusinessRuleViolationException(error.message);
    }

    await this.videoRepository.save(video);

    // 3. Enviar a tarefa para a fila
    await this.queueService.sendMessage("video-processing-queue", { videoId });

    // 4. Retornar a resposta
    return { message: "Video processing started successfully." };
  }
}
