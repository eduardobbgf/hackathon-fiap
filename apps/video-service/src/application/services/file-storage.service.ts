// src/infrastructure/services/s3-file-storage.service.ts

import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as path from "path";
import * as archiver from "archiver";
import { IFileStorageService } from "../ports/file-storage.service.interface";
import { UploadedFile } from "../ports/upload-file.interface";

@Injectable()
export class FileStorageService implements IFileStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly logger = new Logger(FileStorageService.name);

  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME;
    this.region = process.env.AWS_REGION;

    this.s3Client = new S3Client({
      region: this.region,
    });
  }

  async upload(file: UploadedFile, filename: string): Promise<string> {
    const key = `videos/${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return key;
  }

  async createZipFile(filePaths: string[]): Promise<string> {
    const zipKey = `zips/frames-${Date.now()}.zip`;
    const archive = archiver("zip", { zlib: { level: 9 } });

    this.logger.log(`Iniciando a criação do ZIP para os arquivos:`, filePaths);
    if (filePaths.length === 0) {
      throw new Error(
        "Não é possível criar um ZIP a partir de um array vazio.",
      );
    }

    // A MUDANÇA ESTÁ AQUI: Nós vamos "promisify" o processo de streaming
    const createZipBuffer = (): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];

        // Escuta por pedaços de dados e os armazena
        archive.on("data", (chunk) => {
          chunks.push(chunk);
        });

        // Quando o stream termina, junta os pedaços em um único buffer
        archive.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        // Se der erro, rejeita a promise
        archive.on("error", (error) => {
          reject(error);
        });
      });
    };

    // Inicia a "promessa" de criar o buffer
    const zipBufferPromise = createZipBuffer();

    // Adiciona os arquivos ao stream
    filePaths.forEach((filePath) => {
      archive.file(filePath, { name: path.basename(filePath) });
    });

    // Finaliza o arquivamento (isso vai disparar os eventos 'data' e 'end')
    await archive.finalize();

    // Espera a promise ser resolvida com o buffer completo
    const zipBuffer = await zipBufferPromise;

    this.logger.log(
      `Buffer do ZIP criado com sucesso. Tamanho: ${zipBuffer.length} bytes.`,
    );

    // Agora faz o upload do BUFFER, que tem um tamanho bem definido
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: zipKey,
      Body: zipBuffer,
      ContentType: "application/zip",
      ContentLength: zipBuffer.length, // Opcional, mas boa prática
    });

    await this.s3Client.send(command);
    this.logger.log(`Upload do ZIP para ${zipKey} concluído.`);
    return zipKey;
  }

  getFilename(key: string): string {
    return path.basename(key);
  }

  async getFilePath(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  }

  async deleteFiles(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    const objectsToDelete = keys.map((key) => ({ Key: key }));

    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: { Objects: objectsToDelete },
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`Arquivos deletados com sucesso: ${keys.join(", ")}`);
    } catch (error) {
      this.logger.error(`Falha ao deletar arquivos do S3`, error);
      // Opcional: Lançar o erro novamente se a falha na deleção for crítica
      // throw error;
    }
  }
}
