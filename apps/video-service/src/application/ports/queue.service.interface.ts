export interface IQueueService {
  sendMessage<T>(queueName: string, message: T): Promise<void>;
}
