import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { IUserRepository } from "../../domain";
import databaseConfig from "../config/database.config";

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get("database"),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
  ],
  exports: ["IUserRepository"],
})
export class DatabaseModule {}
