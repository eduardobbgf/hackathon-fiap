import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthLibModule {}
