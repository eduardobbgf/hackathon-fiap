import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as archiver from "archiver";
import { IFileStorageService } from "../ports/file-storage.service.interface";
import { UploadedFile } from "../ports/upload-file.interface";

@Injectable()
export class FileStorageService implements IFileStorageService {
  private readonly videosStoragePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "storage",
    "videos",
  );
  private readonly zipsStoragePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "storage",
    "zips",
  );

  constructor() {
    // Garante que as pastas de armazenamento existem
    if (!fs.existsSync(this.videosStoragePath)) {
      fs.mkdirSync(this.videosStoragePath, { recursive: true });
    }
    if (!fs.existsSync(this.zipsStoragePath)) {
      fs.mkdirSync(this.zipsStoragePath, { recursive: true });
    }
  }

  async upload(file: UploadedFile, filename: string): Promise<string> {
    const filePath = path.join(this.videosStoragePath, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    return filePath;
  }

  async createZipFile(filePaths: string[]): Promise<string> {
    const zipFilename = `frames-${Date.now()}.zip`;
    const zipFilePath = path.join(this.zipsStoragePath, zipFilename);
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Nível de compressão
    });

    return new Promise((resolve, reject) => {
      output.on("close", () => {
        resolve(zipFilePath);
      });
      archive.on("error", (err) => {
        reject(err);
      });
      archive.pipe(output);
      filePaths.forEach((filePath) => {
        archive.file(filePath, { name: path.basename(filePath) });
      });
      archive.finalize();
    });
  }
}
