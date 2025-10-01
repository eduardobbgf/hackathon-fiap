import { UploadedFile } from "./upload-file.interface";

export interface IFileStorageService {
  upload(file: UploadedFile, filename: string): Promise<string>;
  createZipFile(filePaths: string[]): Promise<string>;
  deleteFiles(keys: string[]): Promise<void>;
  getFilePath(key: string): Promise<string>;
  getFilename(key: string): string;
}
