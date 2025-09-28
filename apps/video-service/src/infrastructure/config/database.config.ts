import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { VideoEntity } from "../database/entity/video.entity";
import { FrameEntity } from "../database/entity/frame.entity";

export default registerAs(
  "database",
  (): TypeOrmModuleOptions => ({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "fiap_video_db",
    entities: [VideoEntity, FrameEntity],
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
    migrations: ["dist/infrastructure/database/migrations/*.js"],
    migrationsTableName: "migrations",
  }),
);
