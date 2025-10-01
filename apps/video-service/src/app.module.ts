import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { VideoModule } from "./infrastructure/modules/video.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import databaseConfig from "./infrastructure/config/database.config";
import { AuthLibModule } from "@app/auth-lib";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get("database"),
      inject: [ConfigService],
    }),

    DatabaseModule,
    AuthLibModule,
    VideoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
