// apps/user-service/src/infrastructure/auth/strategies/local.strategy.ts

import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { BusinessRuleViolationException } from "@app/shared";
import { Email } from "../../../domain/value-objects/email.vo";
import { Password } from "../../../domain/value-objects/password.vo";
import { AuthenticateUserUseCase } from "apps/user-service/src/application";
import { User, UserStatus } from "apps/user-service/src/domain";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {
    super({ usernameField: "email", passwordField: "password" });
  }

  async validate(email: string, pass: string): Promise<User> {
    try {
      console.log(
        `[LocalStrategy] Delegando validação para AuthenticateUserUseCase para o email: ${email}`,
      );
      const authResponse = await this.authenticateUserUseCase.execute({
        email: email,
        password: pass,
      });

      const userData = authResponse.user;
      const dummyPassword = await Password.create("ValidDummyPass1");

      const userInstance = new User(
        userData.name,
        new Email(userData.email),
        dummyPassword,
        userData.id,
        userData.status as UserStatus,
      );

      return userInstance;
    } catch (error) {
      if (error instanceof BusinessRuleViolationException) {
        throw new UnauthorizedException(error.message);
      }
      console.error(
        "[LocalStrategy] Erro inesperado durante a validação:",
        error,
      );
      throw new UnauthorizedException(
        "Ocorreu um erro durante a autenticação.",
      );
    }
  }
}
