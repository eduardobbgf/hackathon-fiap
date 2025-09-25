import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { UserService } from "../../application/services/user.service";
import { AuthenticateUserUseCase } from "../../application/use-cases/authenticate-user/authenticate-user.use-case";
import { GetUserUseCase } from "../../application/use-cases/get-user/get-user.use-case";
import { UpdateUserUseCase } from "../../application/use-cases/update-user/update-user.use-case";
import { IUserService } from "../../application/ports/user.service.interface";
import { CreateUserUseCase } from "../../application/use-cases/create-user/create-user.use-case";

@Module({
  imports: [DatabaseModule, AuthModule], // <-- Removido AuthenticateUserUseCase
  controllers: [UserController, AuthController],
  providers: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,

    // Services
    {
      provide: "IUserService",
      useClass: UserService,
    },
  ],
  exports: ["IUserService"],
})
export class UserModule {}
