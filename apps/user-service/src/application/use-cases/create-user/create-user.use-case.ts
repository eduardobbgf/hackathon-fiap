import { Inject, Injectable } from "@nestjs/common";
import { IUseCase, BusinessRuleViolationException } from "@app/shared";
import { IUserRepository, Email, UserAggregate } from "../../../domain";
import { CreateUserDto, CreateUserResponseDto } from "./create-user.dto";
import { IUserService } from "../../ports/user.service.interface";

@Injectable()
export class CreateUserUseCase
  implements IUseCase<CreateUserDto, CreateUserResponseDto>
{
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: CreateUserDto): Promise<CreateUserResponseDto> {
    const email = new Email(request.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BusinessRuleViolationException(
        "User with this email already exists",
      );
    }

    const userAggregate = await UserAggregate.create(
      request.name,
      email,
      request.password,
    );

    const savedUser = await this.userRepository.save(userAggregate.user);

    const events = userAggregate.getUncommittedEvents();
    userAggregate.markEventsAsCommitted();

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email.value,
      status: savedUser.status,
      createdAt: savedUser.createdAt,
    };
  }
}
