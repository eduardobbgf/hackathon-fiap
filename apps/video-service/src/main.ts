import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module";

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
