import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../../application/services/user.service";
import { AuthenticateUserUseCase } from "../../application/use-cases/authenticate-user/authenticate-user.use-case";
import { GetUserUseCase } from "../../application/use-cases/get-user/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/update-user/update-user.use-case";
import { IUserService } from "../../application/ports/user.service.interface";
import { CreateUserUseCase } from "../../application/use-cases/create-user/create-user.use-case";
import { ConfigModule } from "@nestjs/config";
import { AuthLibModule, JwtAuthGuard } from "@app/auth-lib"; // Importe a lib pelo alias do tsconfig
import { APP_GUARD } from "@nestjs/core";
import { LocalStrategy } from "../auth/strategies/local.strategy";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtServiceImpl } from "../auth/services/jwt.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthLibModule,
    DatabaseModule,
    JwtModule.register({}),
  ],
  controllers: [UserController, AuthController],
  providers: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    LocalStrategy,
    {
      provide: "IJwtService",
      useClass: JwtServiceImpl,
    },

    {
      provide: "IUserService",
      useClass: UserService,
    },
  ],
  exports: ["IUserService", "IJwtService"],
})
export class UserModule {}
