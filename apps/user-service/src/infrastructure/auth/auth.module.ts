import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtServiceImpl } from './jwt.service';
import { IJwtService } from '../../application/ports/jwt.service.interface';
import { DatabaseModule } from '../database/database.module';
import jwtConfig from '../config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: { 
          expiresIn: configService.get<string>('jwt.accessExpiresIn') 
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    {
      provide: 'IJwtService',
      useClass: JwtServiceImpl,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: ['IJwtService'],
})
export class AuthModule {}
