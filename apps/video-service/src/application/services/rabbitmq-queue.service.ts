import { Injectable } from "@nestjs/common";
import { IQueueService } from "../ports/queue.service.interface";
import { connect, Channel, Connection } from "amqplib";

@Injectable()
export class RabbitMQQueueService implements IQueueService {
  private channel: Channel;
  private connection: any;

  constructor() {
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await connect("amqp://localhost"); // Substitua pela URL do seu RabbitMQ
      this.channel = await this.connection.createChannel();
      console.log("✅ Connected to RabbitMQ");
    } catch (error) {
      console.error("❌ Failed to connect to RabbitMQ:", error);
      // Aqui você pode adicionar lógica de reconexão ou tratamento de erro
    }
  }

  async sendMessage<T>(queueName: string, message: T): Promise<void> {
    if (!this.channel) {
      console.error("RabbitMQ channel is not available.");
      return;
    }
    await this.channel.assertQueue(queueName, { durable: false });
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`✉️ Message sent to queue "${queueName}"`);
  }
}
