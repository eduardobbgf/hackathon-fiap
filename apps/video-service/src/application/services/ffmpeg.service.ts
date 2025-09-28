import { Injectable } from "@nestjs/common";
import { IVideoProcessingService } from "../../application/ports/video-processing.service.interface";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FFmpegService implements IVideoProcessingService {
  private readonly framesOutputPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "temp",
    "frames",
  );

  constructor() {
    // Garante que a pasta de saída de frames existe
    if (!fs.existsSync(this.framesOutputPath)) {
      fs.mkdirSync(this.framesOutputPath, { recursive: true });
    }
  }

  async processVideo(
    filePath: string,
  ): Promise<{ frameCount: number; frameFilePaths: string[] }> {
    return new Promise((resolve, reject) => {
      const outputPattern = path.join(this.framesOutputPath, "frame-%04d.png");

      // Comando FFmpeg para extrair frames como PNG a uma taxa de 1 frame/segundo
      const command = `ffmpeg -i "${filePath}" -vf "fps=1" "${outputPattern}"`;

      exec(command, (error) => {
        if (error) {
          console.error(`FFmpeg processing error: ${error.message}`);
          return reject(new Error("Video processing failed."));
        }

        // Lógica para contar os frames extraídos
        fs.readdir(this.framesOutputPath, (err, files) => {
          if (err) {
            return reject(err);
          }

          const frameFiles = files.filter(
            (file) => path.extname(file).toLowerCase() === ".png",
          );
          const frameFilePaths = frameFiles.map((file) =>
            path.join(this.framesOutputPath, file),
          );

          resolve({ frameCount: frameFilePaths.length, frameFilePaths });
        });
      });
    });
  }
}
