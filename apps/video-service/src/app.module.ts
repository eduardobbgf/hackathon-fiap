// src/app.module.ts

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { VideoModule } from "./infrastructure/modules/video.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import databaseConfig from "./infrastructure/config/database.config";
import { AuthLibModule } from "@app/auth-lib"; // <-- Importe os tipos
import { v4 as uuidv4 } from "uuid";
import { LoggerModule } from "nestjs-pino";

// O AppMdule agora importa apenas os módulos de DENTRO do seu serviço

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna as configurações disponíveis globalmente
      load: [databaseConfig], // Carrega a sua configuração de banco de dados
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule para ter acesso ao ConfigService
      useFactory: (configService: ConfigService) =>
        configService.get("database"), // Pega a configuração pelo nome 'database'
      inject: [ConfigService], // Injeta o ConfigService na factory
    }),

    // 2. Configura a conexão global do banco de dados para ESTE serviço

    DatabaseModule, // Usa o módulo centralizado de banco de dados
    AuthLibModule,
    // 3. Importa o módulo principal de funcionalidades deste serviço
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
