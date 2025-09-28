import { UploadedFile } from "./upload-file.interface";

export interface IFileStorageService {
  upload(file: UploadedFile, filename: string): Promise<string>;
  createZipFile(filePaths: string[]): Promise<string>;
}
