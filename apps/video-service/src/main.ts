import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.RABBIT_VIDEO_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  app.setGlobalPrefix("api/v1");

  const config = new DocumentBuilder()
    .setTitle("User Service API")
    .setDescription("Documentação da API para o User Service")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("docs", app, document);

  const port = 3001;

  await app.listen(port);

  console.log(
    `🚀 Video Service is running on: http://localhost:${port}/api/v1`,
  );
}

bootstrap();
