import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { ProcessVideoUseCase } from "../../application";

@Controller()
export class VideoWorkerController {
  constructor(private readonly processVideoUseCase: ProcessVideoUseCase) {}

  @EventPattern("video_uploaded")
  async handleVideoUploaded(
    @Payload() data: { videoId: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log(
      `[VideoWorker] Mensagem recebida para processar vídeo: ${data.videoId}`,
    );

    channel.ack(originalMsg);
    console.log(
      `[VideoWorker] Mensagem para o vídeo ${data.videoId} confirmada (ack). Iniciando processamento longo.`,
    );

    try {
      await this.processVideoUseCase.execute({ videoId: data.videoId });

      console.log(
        `[VideoWorker] Vídeo ${data.videoId} processado com sucesso.`,
      );
    } catch (error) {
      console.error(
        `[VideoWorker] Falha CRÍTICA ao processar vídeo ${data.videoId}:`,
        error,
      );
    }
  }
}
