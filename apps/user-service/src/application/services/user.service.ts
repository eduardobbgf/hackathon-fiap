import { Inject, Injectable } from "@nestjs/common";
import { EntityNotFoundException } from "@app/shared";
import { IUserRepository, UserAggregate } from "../../domain";
import { IUserService } from "../ports/user.service.interface";
import { AuthenticateUserUseCase } from "../use-cases/authenticate-user/authenticate-user.use-case";
import { GetUserUseCase } from "../use-cases/get-user/get-user.use-case";
import { UpdateUserUseCase } from "../use-cases/update-user/update-user.use-case";
import {
  CreateUserDto,
  CreateUserResponseDto,
} from "../use-cases/create-user/create-user.dto";
import {
  AuthenticateUserDto,
  AuthenticateUserResponseDto,
} from "../use-cases/authenticate-user/authenticate-user.dto";
import {
  GetUserDto,
  GetUserResponseDto,
} from "../use-cases/get-user/get-user.dto";
import {
  UpdateUserDto,
  UpdateUserResponseDto,
} from "../use-cases/update-user/update-user.dto";
import { CreateUserUseCase } from "../use-cases/create-user/create-user.use-case";

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {}

  async createUser(dto: CreateUserDto): Promise<CreateUserResponseDto> {
    return this.createUserUseCase.execute(dto);
  }

  async authenticateUser(
    dto: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponseDto> {
    return this.authenticateUserUseCase.execute(dto);
  }

  async getUserById(dto: GetUserDto): Promise<GetUserResponseDto> {
    return this.getUserUseCase.execute(dto);
  }

  async updateUser(dto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    return this.updateUserUseCase.execute(dto);
  }

  async deactivateUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException("User", id);
    }

    const userAggregate = new UserAggregate(user);
    userAggregate.deactivate();

    await this.userRepository.update(id, userAggregate.user);

    // Processar eventos de domínio
    const events = userAggregate.getUncommittedEvents();
    userAggregate.markEventsAsCommitted();
  }

  async activateUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new EntityNotFoundException("User", id);
    }

    const userAggregate = new UserAggregate(user);
    userAggregate.activate();

    await this.userRepository.update(id, userAggregate.user);

    // Processar eventos de domínio
    const events = userAggregate.getUncommittedEvents();
    userAggregate.markEventsAsCommitted();
  }
}
