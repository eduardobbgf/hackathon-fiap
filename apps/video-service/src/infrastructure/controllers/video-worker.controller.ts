// apps/video-service/src/infrastructure/controllers/video-worker.controller.ts

import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { ProcessVideoUseCase } from "../../application";

@Controller()
export class VideoWorkerController {
  constructor(private readonly processVideoUseCase: ProcessVideoUseCase) {}

  // O decorador @EventPattern diz ao NestJS para ouvir por este evento específico.
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

    try {
      // Chama o seu caso de uso existente para fazer o trabalho pesado
      await this.processVideoUseCase.execute({ videoId: data.videoId });

      // Se o processamento for bem-sucedido, remove a mensagem da fila.
      channel.ack(originalMsg);
      console.log(
        `[VideoWorker] Vídeo ${data.videoId} processado com sucesso. Mensagem confirmada (ack).`,
      );
    } catch (error) {
      console.error(
        `[VideoWorker] Falha ao processar vídeo ${data.videoId}:`,
        error,
      );
      // Em caso de erro, você pode optar por rejeitar a mensagem (nack),
      // o que pode fazê-la ir para uma dead-letter queue se configurado.
      // Por simplicidade, aqui apenas confirmamos para não entrar em loop.
      channel.ack(originalMsg);
    }
  }
}
