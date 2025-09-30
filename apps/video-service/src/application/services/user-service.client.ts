import { Injectable, Inject } from "@nestjs/common";
import { IUserServiceClient } from "../ports/user-service-client.interface";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { User } from "apps/user-service/src/domain";
import { REQUEST } from "@nestjs/core";

@Injectable()
export class UserServiceClient implements IUserServiceClient {
  private readonly userServiceUrl: string;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = process.env.USER_SERVICE_URL;
  }

  async findUserById(userId: string, token: string): Promise<User | null> {
    console.log("aqui");
    console.log(`${this.userServiceUrl}/users/${userId}`);
    const authorizationHeader = this.request.headers["authorization"];
    console.log(authorizationHeader);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.userServiceUrl}/users/${userId}`, // 1. URL (primeiro argumento )
          {
            // 2. Objeto de configuração (segundo argumento)
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
      return new User(data.id, data.name, data.email);
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // Usuário não encontrado
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }
}
