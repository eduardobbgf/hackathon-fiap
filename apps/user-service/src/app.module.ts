import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./infrastructure/modules/user.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { AuthLibModule } from "@app/auth-lib";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    DatabaseModule,
    AuthLibModule,
    UserModule,
  ],
})
export class AppModule {}
