import { Injectable } from "@nestjs/common";
import { INotificationService } from "../../application/ports/notification.service.interface";

@Injectable()
export class NotificationService implements INotificationService {
  async sendNotification(to: string, message: string): Promise<void> {
    console.log(`[NotificationService] Sending notification to: ${to}`);
    console.log(`Message: ${message}`);
  }

  async sendVideoProcessingCompleted(
    to: string,
    videoName: string,
  ): Promise<void> {
    console.log(
      `[NotificationService] Sending "completed" notification to: ${to}`,
    );
    console.log(
      `Message: Your video "${videoName}" has been successfully processed.`,
    );
  }

  async sendVideoProcessingFailed(
    to: string,
    videoName: string,
  ): Promise<void> {
    console.log(
      `[NotificationService] Sending "failed" notification to: ${to}`,
    );
    console.log(
      `Message: We encountered an issue while processing your video "${videoName}".`,
    );
  }
}
