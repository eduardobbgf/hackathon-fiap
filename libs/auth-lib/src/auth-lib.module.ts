// libs/auth-lib/src/auth-lib.module.ts

import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy"; // Caminho atualizado

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Cada app fornecerá sua própria ConfigModule
      useFactory: (configService: ConfigService) => ({
        // O segredo será lido das variáveis de ambiente do app que usar a lib
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy], // A estratégia é o coração da validação
  exports: [PassportModule], // Exporte para que os Guards funcionem
})
export class AuthLibModule {}
