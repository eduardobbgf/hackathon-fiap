import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthenticateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

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
