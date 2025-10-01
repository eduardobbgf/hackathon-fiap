import { Inject, Injectable } from "@nestjs/common";
import {
  IUseCase,
  EntityNotFoundException,
  BusinessRuleViolationException,
} from "@app/shared";
import { IUserRepository, Email, UserAggregate } from "../../../domain";
import { UpdateUserDto, UpdateUserResponseDto } from "./update-user.dto";

@Injectable()
export class UpdateUserUseCase
  implements IUseCase<UpdateUserDto, UpdateUserResponseDto>
{
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async execute(request: UpdateUserDto): Promise<UpdateUserResponseDto> {
    const existingUser = await this.userRepository.findById(request.id);
    if (!existingUser) {
      throw new EntityNotFoundException("User", request.id);
    }

    const userAggregate = new UserAggregate(existingUser);

    if (request.name) {
      userAggregate.updateName(request.name);
    }

    if (request.email) {
      const newEmail = new Email(request.email);

      const existingUserWithEmail =
        await this.userRepository.findByEmail(newEmail);
      if (existingUserWithEmail && existingUserWithEmail.id !== request.id) {
        throw new BusinessRuleViolationException(
          "Email is already in use by another user",
        );
      }

      userAggregate.updateEmail(newEmail);
    }

    if (request.password) {
      await userAggregate.updatePassword(request.password);
    }

    const updatedUser = await this.userRepository.update(
      request.id,
      userAggregate.user,
    );

    const events = userAggregate.getUncommittedEvents();
    userAggregate.markEventsAsCommitted();

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email.value,
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
