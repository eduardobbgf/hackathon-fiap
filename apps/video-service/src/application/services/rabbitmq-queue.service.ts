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
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBIT_VIDEO_QUEUE,
      },
    });
  }

  /**
   * Publica uma mensagem na fila de processamento de vídeo.
   * @param videoId O ID do vídeo a ser processado.
   */
  public addVideoToQueue(videoId: string) {
    this.client.emit("video_uploaded", { videoId });
  }
}
