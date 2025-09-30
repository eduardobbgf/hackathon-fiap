import { Injectable } from "@nestjs/common";
import { INotificationService } from "../../application/ports/notification.service.interface";
import * as nodemailer from "nodemailer";

@Injectable()
export class NotificationService implements INotificationService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eduardogusmao7@gmail.com",
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
  }

  async sendNotification(to: string, message: string): Promise<void> {
    console.log(`[NotificationService] Sending notification to: ${to}`);
    console.log(`Message: ${message}`);
  }

  async sendVideoProcessingCompleted(
    to: string,
    videoName: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Video Processing" + videoName,
      html: `<p>Video ${videoName} procesing Completed</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  async sendVideoProcessingFailed(
    to: string,
    videoName: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Video Processing" + videoName,
      html: `<p>Video ${videoName} procesing failed</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Message sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
