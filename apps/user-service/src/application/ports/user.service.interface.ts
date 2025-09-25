import { CreateUserDto, CreateUserResponseDto } from '../use-cases/create-user/create-user.dto';
import { AuthenticateUserDto, AuthenticateUserResponseDto } from '../use-cases/authenticate-user/authenticate-user.dto';
import { GetUserDto, GetUserResponseDto } from '../use-cases/get-user/get-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from '../use-cases/update-user/update-user.dto';

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<CreateUserResponseDto>;
  authenticateUser(dto: AuthenticateUserDto): Promise<AuthenticateUserResponseDto>;
  getUserById(dto: GetUserDto): Promise<GetUserResponseDto>;
  updateUser(dto: UpdateUserDto): Promise<UpdateUserResponseDto>;
  deactivateUser(id: string): Promise<void>;
  activateUser(id: string): Promise<void>;
}
