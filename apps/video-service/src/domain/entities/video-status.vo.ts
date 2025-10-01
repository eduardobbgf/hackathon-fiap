export class VideoStatus {
  public constructor(public readonly value: string) {}

  public static UPLOADED(): VideoStatus {
    return new VideoStatus("uploaded");
  }
  public static PROCESSING(): VideoStatus {
    return new VideoStatus("processing");
  }
  public static COMPLETED(): VideoStatus {
    return new VideoStatus("completed");
  }
  public static ERROR(): VideoStatus {
    return new VideoStatus("error");
  }

  public static fromValue(value: string): VideoStatus {
    const statuses = [
      this.UPLOADED(),
      this.PROCESSING(),
      this.COMPLETED(),
      this.ERROR(),
    ];
    const foundStatus = statuses.find((s) => s.value === value);
    if (!foundStatus) {
      throw new Error(`Invalid VideoStatus value: ${value}`);
    }
    return foundStatus;
  }
  public equals(other: VideoStatus): boolean {
    if (!other) {
      return false;
    }
    return this.value === other.value;
  }
}
