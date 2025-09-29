// apps/video-service/src/infrastructure/controllers/video-worker.controller.ts

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

    // 1. CONFIRME IMEDIATAMENTE (ACK)
    // Diga ao RabbitMQ: "Recebi a tarefa. Pode remover da fila. Eu cuido daqui pra frente."
    // Isso evita qualquer problema de timeout ou canal fechado.
    channel.ack(originalMsg);
    console.log(
      `[VideoWorker] Mensagem para o vídeo ${data.videoId} confirmada (ack). Iniciando processamento longo.`,
    );

    try {
      // 2. EXECUTE O PROCESSO LONGO
      // Agora, o processamento pode demorar o tempo que for necessário.
      // O RabbitMQ não está mais esperando por uma resposta.
      await this.processVideoUseCase.execute({ videoId: data.videoId });

      console.log(
        `[VideoWorker] Vídeo ${data.videoId} processado com sucesso.`,
      );
    } catch (error) {
      // 3. TRATAMENTO DE ERRO MANUAL
      // Como já demos o 'ack', o RabbitMQ não vai reenfileirar a mensagem.
      // Precisamos lidar com a falha manualmente.
      console.error(
        `[VideoWorker] Falha CRÍTICA ao processar vídeo ${data.videoId}:`,
        error,
      );

      // O que fazer aqui?
      // - Logar o erro em um sistema de monitoramento (Sentry, Datadog).
      // - Atualizar o status do vídeo no banco de dados para 'FAILED'.
      // - Enviar a mensagem para uma outra fila, uma "dead-letter queue", para tentativa manual posterior.
      // Por enquanto, vamos apenas logar e atualizar o status (assumindo que o use case faz isso).
    }
  }
}
