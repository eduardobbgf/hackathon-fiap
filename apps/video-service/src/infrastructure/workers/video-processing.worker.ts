import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { IVideoRepository } from "../../domain/repositories/video.repository.interface";
import { IVideoProcessingService } from "../../application/ports/video-processing.service.interface";
import { INotificationService } from "../../application/ports/notification.service.interface";
import { IQueueService } from "../../application";
import { Frame, Video } from "../../domain";

@Injectable()
export class VideoProcessingWorker implements OnModuleInit {
  private readonly queueName = "video-processing-queue";

  constructor(
    @Inject("IQueueService")
    private readonly queueService: IQueueService,
    @Inject("IVideoRepository")
    private readonly videoRepository: IVideoRepository,
    @Inject("IVideoProcessingService")
    private readonly videoProcessingService: IVideoProcessingService,
    @Inject("INotificationService")
    private readonly notificationService: INotificationService,
  ) {}

  onModuleInit() {
    // Inicia o worker assim que o módulo é inicializado
    this.startListening();
  }

  private async startListening() {
    // console.log(
    //   `🎬 VideoProcessingWorker is listening to queue "${this.queueName}"...`,
    // );
    // // Simula a escuta de uma fila em um ambiente de desenvolvimento ou teste
    // // Em produção, isso seria uma implementação real de consumidor de fila (ex: RabbitMQ consumer)
    // setInterval(async () => {
    //   // Esta é uma simulação. Em uma implementação real, o worker receberia
    //   // a mensagem diretamente do RabbitMQ ou outro serviço de fila.
    //   // A lógica abaixo é para exemplificar a ordem de execução do trabalho.
    //   console.log("Checking for new messages in the queue...");
    //   // No caso de uma fila in-memory, o serviço pode ter um método para "puxar" a próxima mensagem
    //   // const message = await this.queueService.pollMessage(this.queueName);
    //   // Exemplo de como a lógica seria executada com uma mensagem recebida:
    //   const mockMessage = { videoId: "mock-video-id-123" }; // Simulação de uma mensagem
    //   if (mockMessage) {
    //     await this.processVideoJob(mockMessage.videoId);
    //   }
    // }, 5000); // Tenta processar a cada 5 segundos
  }

  public async processVideoJob(videoId: string) {
    let video: Video;
    try {
      video = await this.videoRepository.findById(videoId);
      if (!video) {
        throw new Error("Video not found.");
      }

      // ⚙️ Use o método de domínio para iniciar o processamento
      video.startProcessing();
      await this.videoRepository.save(video);
      console.log(`Starting processing for video: ${video.originalName}`);

      // ... sua lógica de processamento
      const { frameCount, frameFilePaths } =
        await this.videoProcessingService.processVideo(video.filename);

      // ✅ Use o método de domínio para marcar como completo
      // video.markAsCompleted(frameCount);
      console.log(
        `Video processing completed for video: ${video.originalName}`,
      );
    } catch (error) {
      console.error(`❌ Video processing failed for video ${videoId}:`, error);
      if (video) {
        // ❌ Use o método de domínio para marcar como erro
        // video.markAsFailed();
        await this.videoRepository.save(video);
      }
    }
  }
}
