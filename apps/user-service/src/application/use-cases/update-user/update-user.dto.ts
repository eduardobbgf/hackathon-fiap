import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "ID do usuário que será atualizado.",
    example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @ApiProperty({
    description: "O novo nome do usuário (opcional).",
    example: "Maria Souza",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    description: "O novo e-mail do usuário (opcional).",
    example: "maria.souza@example.com",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "A nova senha do usuário (opcional). Mínimo de 8 caracteres.",
    example: "NovaSenha@123",
    required: false,
    format: "password",
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
export class UpdateUserResponseDto {
  id: string;
  name: string;
  email: string;
  status: string;
  updatedAt: Date;
}
