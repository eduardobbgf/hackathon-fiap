import { VideoStatus } from "./video-status.vo";

export class Video {
  private _zipFilename?: string;

  constructor(
    private _id: string,
    private _filename: string,
    private _originalName: string,
    private _size: number,
    private _status: VideoStatus,
    private _frameCount: number,
    private _userId: string,
    private _userEmail: string,
    private _createdAt: Date,
    private _updatedAt: Date,
    zipFilename?: string,
  ) {
    this._zipFilename = zipFilename;
  }

  public static create(data: {
    id: string;
    filename: string;
    originalName: string;
    size: number;
    userId: string;
    userEmail: string;
  }): Video {
    return new Video(
      data.id,
      data.filename,
      data.originalName,
      data.size,
      VideoStatus.UPLOADED(),
      0,
      data.userId,
      data.userEmail,
      new Date(),
      new Date(),
    );
  }

  get id(): string {
    return this._id;
  }

  get filename(): string {
    return this._filename;
  }

  get originalName(): string {
    return this._originalName;
  }

  get size(): number {
    return this._size;
  }

  get status(): string {
    return this._status.value;
  }

  get frameCount(): number {
    return this._frameCount;
  }

  get userId(): string {
    return this._userId;
  }

  get userEmail(): string {
    return this._userEmail;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get zipFilename(): string | undefined {
    return this._zipFilename;
  }

  public startProcessing(): void {
    if (!this._status.equals(VideoStatus.UPLOADED())) {
      throw new Error(
        "Apenas vídeos com status 'UPLOADED' podem iniciar o processamento.",
      );
    }
    this._status = VideoStatus.PROCESSING();
    this.touch();
  }

  public completeProcessing(frameCount: number, zipFilename: string): void {
    if (!this._status.equals(VideoStatus.PROCESSING())) {
      throw new Error(
        "Apenas vídeos com status 'PROCESSING' podem ser marcados como completos.",
      );
    }
    this._status = VideoStatus.COMPLETED();
    this._frameCount = frameCount;
    this._zipFilename = zipFilename;
    this.touch();
  }

  public failProcessing(): void {
    this._status = VideoStatus.ERROR();
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
