import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class QueueService implements OnModuleInit {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBIT_VIDEO_QUEUE,
      },
    });
  }

  public addVideoToQueue(videoId: string) {
    this.client.emit("video_uploaded", { videoId });
  }
}
