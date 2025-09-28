import { Inject, Injectable } from "@nestjs/common";
import { IUseCase, BusinessRuleViolationException } from "@app/shared";
import { IUserRepository, Email } from "../../../domain";
import { IJwtService } from "../../ports/jwt.service.interface";
import {
  AuthenticateUserDto,
  AuthenticateUserResponseDto,
} from "./authenticate-user.dto";

@Injectable()
@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
    @Inject("IJwtService") private readonly jwtService: IJwtService,
  ) {
    console.log("AuthenticateUserUseCase instanciado.");
    console.log("userRepository injetado:", !!this.userRepository); // Deve ser true
    console.log("jwtService injetado:", !!this.jwtService); // Deve ser true
  }

  async execute(
    request: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponseDto> {
    const email = new Email(request.email);

    console.log("AuthenticateUserUseCase.execute chamado com:", request.email);
    // Buscar usuário pelo email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BusinessRuleViolationException("Invalid credentials");
    }
    console.log("Teste 1");

    // Verificar se o usuário está ativo
    if (!user.isActive()) {
      throw new BusinessRuleViolationException("User account is not active");
    }
    console.log("Teste 2");

    // Validar senha
    const isPasswordValid = await user.validatePassword(request.password);
    if (!isPasswordValid) {
      throw new BusinessRuleViolationException("Invalid credentials");
    }
    console.log("Teste 3");

    // Gerar tokens JWT
    const payload = {
      sub: user.id,
      email: user.email.value,
      name: user.name,
    };

    const accessToken = await this.jwtService.generateAccessToken(payload);
    const refreshToken = await this.jwtService.generateRefreshToken(payload);
    console.log(accessToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email.value,
        status: user.status,
      },
    };
  }
}
