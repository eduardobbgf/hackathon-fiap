import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { IUserService } from "../../application/ports/user.service.interface";
import {
  AuthenticateUserDto,
  AuthenticateUserResponseDto,
} from "../../application";
import { Public } from "@app/auth-lib";
import { LocalAuthGuard } from "@app/auth-lib/guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("IUserService") private readonly userService: IUserService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponseDto> {
    console.log("Controller");
    return this.userService.authenticateUser(loginDto);
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    // TODO: Implementar refresh token logic
    throw new Error("Refresh token not implemented yet");
  }
}
