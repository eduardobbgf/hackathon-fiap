import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "Nome do usuário",
    example: "João Silva",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "O endereço de e-mail do usuário. Deve ser único.",
    example: "joao.silva@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      "A senha deve conter pelo menos 8 caracteres, uma maíscula, uma minúsculas e pelo menos um caracter especial",
    example: "senhaSegura1!",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateUserResponseDto {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
}
