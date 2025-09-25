import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}

export class GetUserResponseDto {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
