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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    @Inject("IUserService") private readonly userService: IUserService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Cria um novo usuário" })
  @ApiResponse({
    status: 201,
    description: "Usuário criado com sucesso.",
    type: CreateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos." })
  @ApiResponse({ status: 409, description: "E-mail já cadastrado." })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get("me")
  @ApiOperation({ summary: "Obtém os dados do usuário autenticado" })
  @ApiResponse({
    status: 200,
    description: "Dados do usuário logado.",
    type: GetUserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async getCurrentUser(
    @CurrentUser() user: CurrentUserData,
  ): Promise<GetUserResponseDto> {
    return this.userService.getUserById({ id: user.id });
  }

  @Get(":id")
  @ApiOperation({ summary: "Busca um usuário pelo ID" })
  @ApiResponse({
    status: 200,
    description: "Usuário encontrado.",
    type: GetUserResponseDto,
  })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Usuário não encontrado." })
  async getUserById(@Param("id") id: string): Promise<GetUserResponseDto> {
    return this.userService.getUserById({ id });
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualiza os dados de um usuário" })
  @ApiResponse({
    status: 200,
    description: "Usuário atualizado com sucesso.",
    type: UpdateUserResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Usuário não encontrado." })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: Omit<UpdateUserDto, "id">,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.updateUser({ ...updateUserDto, id });
  }

  @Put(":id/activate")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Ativa um usuário" })
  @ApiResponse({ status: 204, description: "Usuário ativado com sucesso." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Usuário não encontrado." })
  async activateUser(@Param("id") id: string): Promise<void> {
    return this.userService.activateUser(id);
  }

  @Put(":id/deactivate")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Desativa um usuário" })
  @ApiResponse({ status: 204, description: "Usuário desativado com sucesso." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  @ApiResponse({ status: 404, description: "Usuário não encontrado." })
  async deactivateUser(@Param("id") id: string): Promise<void> {
    return this.userService.deactivateUser(id);
  }
}
