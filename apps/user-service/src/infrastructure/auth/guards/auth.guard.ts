// apps/user-service/src/infrastructure/auth/guards/local-auth.guard.ts

import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Este Guard é responsável por acionar a estratégia de autenticação 'local'.
 * Ele será usado para proteger o endpoint de login.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {}
