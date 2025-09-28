import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from "@nestjs/common";
import { IUserService } from "../../application/ports/user.service.interface";
import {
  CreateUserDto,
  CreateUserResponseDto,
  GetUserDto,
  GetUserResponseDto,
  UpdateUserDto,
  UpdateUserResponseDto,
} from "../../application";
import {
  CurrentUser,
  CurrentUserData,
  JwtAuthGuard,
  Public,
} from "@app/auth-lib";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    @Inject("IUserService") private readonly userService: IUserService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get("me")
  async getCurrentUser(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GetUserResponseDto> {
    return this.userService.getUserById({ id: user.id });
  }

  @Get(":id")
  async getUserById(@Param("id") id: string): Promise<GetUserResponseDto> {
    return this.userService.getUserById({ id });
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: Omit<UpdateUserDto, "id">,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.updateUser({ ...updateUserDto, id });
  }

  @Put(":id/activate")
  @HttpCode(HttpStatus.NO_CONTENT)
  async activateUser(@Param("id") id: string): Promise<void> {
    return this.userService.activateUser(id);
  }

  @Put(":id/deactivate")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateUser(@Param("id") id: string): Promise<void> {
    return this.userService.deactivateUser(id);
  }
}
