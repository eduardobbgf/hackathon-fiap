import { VideoStatus } from "./video-status.vo";

export class Video {
  constructor(
    private _id: string,
    private _filename: string,
    private _originalName: string,
    private _size: number,
    private _status: VideoStatus,
    private _frameCount: number,
    private _userId: string,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  public static create(data: {
    id: string;
    filename: string;
    originalName: string;
    size: number;
    userId: string;
  }): Video {
    return new Video(
      data.id,
      data.filename,
      data.originalName,
      data.size,
      VideoStatus.UPLOADED(),
      0,
      data.userId,
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

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public startProcessing(): void {
    if (this._status.equals(VideoStatus.UPLOADED())) {
      this._status = VideoStatus.PROCESSING();
      this._updatedAt = new Date();
    } else {
      throw new Error(
        "Cannot start processing a video that is not in the UPLOADED status.",
      );
    }
  }

  public markAsCompleted(frameCount: number): void {
    this._status = VideoStatus.COMPLETED();
    this._frameCount = frameCount;
    this._updatedAt = new Date();
  }

  public markAsFailed(): void {
    this._status = VideoStatus.ERROR();
    this._updatedAt = new Date();
  }
}
