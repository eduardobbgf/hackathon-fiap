export interface INotificationService {
  sendNotification(to: string, message: string): Promise<void>;
  sendVideoProcessingCompleted(to: string, videoName: string): Promise<void>;
  sendVideoProcessingFailed(to: string, videoName: string): Promise<void>;
}
