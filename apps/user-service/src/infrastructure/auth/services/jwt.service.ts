// apps/user-service/src/infrastructure/auth/services/jwt.service.ts

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import {
  IJwtService,
  JwtPayload,
} from "../../../application/ports/jwt.service.interface";

@Injectable()
export class JwtServiceImpl implements IJwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(
    payload: Omit<JwtPayload, "iat" | "exp">,
  ): Promise<string> {
    console.log(
      "[JwtServiceImpl] Gerando Access Token...",
      this.configService.get<string>("JWT_ACCESS_SECRET"),
    );
    const secret =
      "ee1d949c31d30ff11676339d802c4b8752a19c17eda164b52e11ac194cbd6114";
    return this.nestJwtService.signAsync(payload, {
      secret: secret,
      expiresIn: "15m",
    });
  }

  async generateRefreshToken(
    payload: Omit<JwtPayload, "iat" | "exp">,
  ): Promise<string> {
    console.log("[JwtServiceImpl] Gerando Refresh Token...");
    const secret =
      "ee1d949c31d30ff11676339d802c4b8752a19c17eda164b52e11ac194cbd6114";
    return this.nestJwtService.signAsync(payload, {
      secret: secret,
      expiresIn: "15m",
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    console.log("[JwtServiceImpl] Verificando Access Token...");
    const secret =
      "ee1d949c31d30ff11676339d802c4b8752a19c17eda164b52e11ac194cbd6114";
    try {
      return await this.nestJwtService.verifyAsync<JwtPayload>(token, {
        secret: secret,
      });
    } catch (error) {
      console.error(
        "[JwtServiceImpl] Falha na verificação do Access Token:",
        error.message,
      );
      throw new UnauthorizedException("Access Token inválido ou expirado.");
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    console.log("[JwtServiceImpl] Verificando Refresh Token...");
    const secret =
      "ee1d949c31d30ff11676339d802c4b8752a19c17eda164b52e11ac194cbd6114";
    try {
      return await this.nestJwtService.verifyAsync<JwtPayload>(token, {
        secret: secret,
      });
    } catch (error) {
      console.error(
        "[JwtServiceImpl] Falha na verificação do Refresh Token:",
        error.message,
      );
      throw new UnauthorizedException("Refresh Token inválido ou expirado.");
    }
  }
}
