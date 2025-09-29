// apps/video-service/src/infrastructure/queue/queue.service.ts

import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class QueueService implements OnModuleInit {
  // O ClientProxy é o objeto usado para enviar mensagens
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    // Inicializa o cliente que irá se conectar ao RabbitMQ
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://guest:guest@localhost:5672"],
        queue: "video_processing_queue",
      },
    });
  }

  /**
   * Publica uma mensagem na fila de processamento de vídeo.
   * @param videoId O ID do vídeo a ser processado.
   */
  public addVideoToQueue(videoId: string) {
    console.log(
      `[QueueService] Adicionando vídeo ${videoId} à fila de processamento.`,
    );
    // 'emit' envia uma mensagem do tipo "evento" (fire-and-forget)
    // O primeiro argumento é o "padrão" ou "tópico" do evento.
    this.client.emit("video_uploaded", { videoId });
  }
}
