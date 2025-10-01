import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthenticateUserDto {
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
  password: string;
}

export class AuthenticateUserResponseDto {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    status: string;
  };
}
