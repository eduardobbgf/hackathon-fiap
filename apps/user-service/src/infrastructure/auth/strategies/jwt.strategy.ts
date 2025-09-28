import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { IUserRepository } from "../../../domain";
import { JwtPayload } from "../../../application/ports/jwt.service.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,

    @Inject("IUserRepository") private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "your-super-secret-access-key",
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.isActive()) {
      throw new UnauthorizedException("User account is not active");
    }

    return {
      id: user.id,
      email: user.email.value,
      name: user.name,
      status: user.status,
    };
  }
}
