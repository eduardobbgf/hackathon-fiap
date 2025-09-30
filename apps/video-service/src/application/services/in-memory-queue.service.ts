import { Injectable } from "@nestjs/common";
import { IQueueService } from "../../application/ports/queue.service.interface";

@Injectable()
export class InMemoryQueueService implements IQueueService {
  private queue: Map<string, any[]> = new Map();

  async sendMessage<T>(queueName: string, message: T): Promise<void> {
    if (!this.queue.has(queueName)) {
      this.queue.set(queueName, []);
    }
    this.queue.get(queueName).push(message);
  }

  // Métodos de ajuda para testes
  public getMessages<T>(queueName: string): T[] {
    return this.queue.get(queueName) || [];
  }

  public clearQueue(queueName: string): void {
    this.queue.set(queueName, []);
  }
}
