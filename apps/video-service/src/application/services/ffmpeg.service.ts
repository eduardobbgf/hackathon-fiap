// apps/video-service/src/infrastructure/services/ffmpeg.service.ts

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
    } else {
      console.log(`[FFmpegService] Diretório de saída já existe.`);
    }
  }

  async processVideo(
    filePath: string,
  ): Promise<{ frameCount: number; frameFilePaths: string[] }> {
    return new Promise((resolve, reject) => {
      const outputPattern = path.join(this.framesOutputPath, "frame-%04d.png");

      // Comando FFmpeg para extrair frames como PNG a uma taxa de 1 frame/segundo
      const command = `ffmpeg -i "${filePath}" -vf "fps=1" "${outputPattern}"`;

      const startTime = Date.now();

      exec(command, (error, stdout, stderr) => {
        const duration = (Date.now() - startTime) / 1000; // Duração em segundos
        if (stdout) {
          console.log(
            `[FFmpegService] Saída padrão (stdout) do FFmpeg:\n${stdout}`,
          );
        }
        if (stderr) {
          console.log(
            `[FFmpegService] Saída de erro (stderr) do FFmpeg:\n${stderr}`,
          );
        }

        if (error) {
          console.error(
            `[FFmpegService] ERRO: O processo FFmpeg falhou. Mensagem: ${error.message}`,
          );
          return reject(new Error("Video processing failed."));
        }

        fs.readdir(this.framesOutputPath, (err, files) => {
          if (err) {
            console.error(
              `[FFmpegService] ERRO: Falha ao ler o diretório de frames: ${err.message}`,
            );
            return reject(err);
          }

          const frameFiles = files.filter(
            (file) => path.extname(file).toLowerCase() === ".png",
          );

          if (frameFiles.length === 0) {
            console.warn(
              "[FFmpegService] AVISO: O FFmpeg foi executado, mas nenhum arquivo .png foi encontrado. Verifique o 'stderr' acima para possíveis problemas no vídeo de entrada.",
            );
          }

          const frameFilePaths = frameFiles.map((file) =>
            path.join(this.framesOutputPath, file),
          );

          resolve({ frameCount: frameFilePaths.length, frameFilePaths });
        });
      });
    });
  }
}
