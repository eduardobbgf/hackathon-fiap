import { VideoStatus } from "./video-status.vo";

export class Video {
  // O _zipFilename é declarado como uma propriedade da classe, não no construtor.
  private _zipFilename?: string;

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
    zipFilename?: string, // Recebido como um parâmetro opcional normal
  ) {
    this._zipFilename = zipFilename;
  }

  /**
   * Método factory para criar uma nova instância de Vídeo no estado inicial.
   */
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
      VideoStatus.UPLOADED(), // O vídeo começa com o status UPLOADED
      0, // Frame count inicial é 0
      data.userId,
      new Date(), // Data de criação
      new Date(), // Data de atualização inicial é a mesma da criação
    );
  }

  // --- Getters para acesso seguro às propriedades ---

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

  // O getter retorna o valor primitivo do Value Object
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

  get zipFilename(): string | undefined {
    return this._zipFilename;
  }

  // --- Métodos de Transição de Estado (Lógica de Negócio) ---

  /**
   * Inicia o processamento do vídeo, mudando seu status.
   */
  public startProcessing(): void {
    if (!this._status.equals(VideoStatus.UPLOADED())) {
      throw new Error(
        "Apenas vídeos com status 'UPLOADED' podem iniciar o processamento.",
      );
    }
    this._status = VideoStatus.PROCESSING();
    this.touch();
  }

  /**
   * Finaliza o processamento com sucesso, atualizando os dados.
   */
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

  /**
   * Marca o processamento do vídeo como falho.
   */
  public failProcessing(): void {
    // Permite marcar como falha a partir de qualquer estado (UPLOADED ou PROCESSING)
    this._status = VideoStatus.ERROR();
    this.touch();
  }

  /**
   * Método privado para atualizar a data de modificação.
   */
  private touch(): void {
    this._updatedAt = new Date();
  }
}
