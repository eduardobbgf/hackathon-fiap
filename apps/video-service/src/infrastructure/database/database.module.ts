// DatabaseModule - Versão Corrigida e Simplificada
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoEntity } from "./entity/video.entity";
import { FrameEntity } from "./entity/frame.entity";
import { VideoEntityRepository } from "./repositories/video.repository";

@Module({
  imports: [
    // 1. Isso disponibiliza `Repository<VideoEntity>` e `Repository<FrameEntity>`
    //    para injeção neste módulo.
    TypeOrmModule.forFeature([VideoEntity, FrameEntity]),
  ],
  providers: [
    // 2. Registre sua classe de repositório como um provedor padrão.
    //    Agora o NestJS irá instanciá-la e injetar as dependências
    //    `@InjectRepository(...)` que ela pede.
    VideoEntityRepository,

    // 3. Crie o alias para a sua interface, mas usando `useExisting`.
    //    Isso diz ao Nest: "Quando alguém pedir 'IVideoRepository',
    //    apenas aponte para a instância já criada de VideoEntityRepository".
    {
      provide: "IVideoRepository",
      useExisting: VideoEntityRepository,
    },
  ],
  // 4. Exporte o token da interface para que outros módulos possam usá-lo.
  exports: ["IVideoRepository"],
})
export class DatabaseModule {}
