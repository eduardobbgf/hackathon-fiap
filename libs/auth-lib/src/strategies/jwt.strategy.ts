// libs/auth-lib/src/strategies/jwt.strategy.ts

import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        "ee1d949c31d30ff11676339d802c4b8752a19c17eda164b52e11ac194cbd6114",
    });
  }

  // O payload do token é retornado aqui
  async validate(payload: any) {
    // Retorna o que será anexado a `req.user`
    return { userId: payload.sub, username: payload.username }; // Ajuste conforme seu payload
  }
}
