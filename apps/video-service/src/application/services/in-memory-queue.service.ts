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
    console.log(`📥 [IN-MEMORY] Message added to queue "${queueName}"`);
    console.log(`Queue "${queueName}" content:`, this.queue.get(queueName));
  }

  // Métodos de ajuda para testes
  public getMessages<T>(queueName: string): T[] {
    return this.queue.get(queueName) || [];
  }

  public clearQueue(queueName: string): void {
    this.queue.set(queueName, []);
  }
}
