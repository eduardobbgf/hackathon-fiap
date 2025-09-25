import { Inject, Injectable } from "@nestjs/common";
import { IUseCase, EntityNotFoundException } from "@app/shared";
import { IUserRepository } from "../../../domain";
import { GetUserDto, GetUserResponseDto } from "./get-user.dto";

@Injectable()
export class GetUserUseCase
  implements IUseCase<GetUserDto, GetUserResponseDto>
{
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: GetUserDto): Promise<GetUserResponseDto> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      throw new EntityNotFoundException("User", request.id);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
