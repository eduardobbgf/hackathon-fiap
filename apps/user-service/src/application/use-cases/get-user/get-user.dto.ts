import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetUserDto {
  @ApiProperty({
    description: "Colocar Id do usuario que quer buscar",
    example: "fdsaf-a23v-dsfa-dcas-fdsf",
  })
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
