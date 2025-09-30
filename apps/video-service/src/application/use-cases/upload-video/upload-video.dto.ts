import { IsNotEmpty, IsString, isString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class UploadVideoDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  userEmail: string;
}
// DTO de Resposta: Dados retornados ao cliente após o upload
export class UploadVideoResponseDto {
  id: string;
  originalName: string;
  status: string;
  createdAt: Date;
}
