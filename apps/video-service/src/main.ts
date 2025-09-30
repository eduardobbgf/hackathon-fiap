import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Validação global com regras de segurança
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do CORS para permitir requisições de outras origens
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
        durable: true, // A fila sobreviverá a reinicializações do broker
      },
    },
  });

  // Inicia todos os microserviços (neste caso, o ouvinte do RabbitMQ)
  await app.startAllMicroservices();
  // Prefixo global para todas as rotas da API
  app.setGlobalPrefix("api/v1");

  // Obtém a porta das variáveis de ambiente com um fallback
  const port = 3001;
  // configService.get<number>("PORT", 3005);

  await app.listen(port);

  console.log(
    `🚀 Video Service is running on: http://localhost:${port}/api/v1`,
  );
}

bootstrap();
