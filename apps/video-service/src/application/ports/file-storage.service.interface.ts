import { UploadedFile } from "./upload-file.interface";

export interface IFileStorageService {
  upload(file: UploadedFile, filename: string): Promise<string>;
  createZipFile(filePaths: string[]): Promise<string>;
  deleteFiles(filePaths: string[]): Promise<void>;
  getFilePath(filename: string): string;
  getFilename(filePath: string): string;
}
