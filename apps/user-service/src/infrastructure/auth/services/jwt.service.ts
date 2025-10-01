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
    return this.nestJwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  }

  async generateRefreshToken(
    payload: Omit<JwtPayload, "iat" | "exp">,
  ): Promise<string> {
    return this.nestJwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: "15m",
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      return await this.nestJwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
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
    try {
      return await this.nestJwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_SECRET,
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
