export class Frame {
  constructor(
    private _id: string,
    private _videoId: string,
    private _frameNumber: number,
    private _filename: string,
    private _path: string,
    private _createdAt: Date,
  ) {}

  get id(): string {
    return this._id;
  }

  get videoId(): string {
    return this._videoId;
  }

  get frameNumber(): number {
    return this._frameNumber;
  }

  get filename(): string {
    return this._filename;
  }

  get path(): string {
    return this._path;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
