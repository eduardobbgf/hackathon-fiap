import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headerToken = request.headers["x-internal-token"];

    const expectedToken = this.configService.get<string>(
      "INTERNAL_SERVICE_TOKEN",
    );

    if (!headerToken || headerToken !== expectedToken) {
      throw new UnauthorizedException(
        "Invalid or missing internal service token.",
      );
    }

    return true;
  }
}
