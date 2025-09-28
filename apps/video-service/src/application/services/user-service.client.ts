import { Injectable, Inject } from "@nestjs/common";
import { IUserServiceClient } from "../ports/user-service-client.interface";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { User } from "apps/user-service/src/domain";

@Injectable()
export class UserServiceClient implements IUserServiceClient {
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = "http://localhost:4001/api/v1";
  }

  async findUserById(userId: string, token: string): Promise<User | null> {
    console.log("aqui");
    console.log(`${this.userServiceUrl}/users/${userId}`);
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
