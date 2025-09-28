export interface IVideoProcessingService {
  processVideo(filePath: string): Promise<{
    frameCount: number;
    frameFilePaths: string[];
  }>;
}
