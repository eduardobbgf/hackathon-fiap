import { Injectable, Inject, Scope } from "@nestjs/common";
import { IUserServiceClient } from "../ports/user-service-client.interface";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { REQUEST } from "@nestjs/core";
import { User } from "../../domain/entities/user.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserServiceClient implements IUserServiceClient {
  private readonly userServiceUrl: string;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = process.env.USER_SERVICE_URL;
  }

  async findUserById(userId: string): Promise<User | null> {
    console.log(this.request);
    console.log("aqui");
    console.log(`${this.userServiceUrl}/users/${userId}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYjJmNDgzZi0zNGI0LTRlZDYtYWY5NS05YmFmZWJlNGQ3OGYiLCJlbWFpbCI6ImpvdGFAeW9wbWFpbC5jb20iLCJuYW1lIjoiSm_Do28gZGEgU2lsdmEiLCJpYXQiOjE3NTkyNTk3NTQsImV4cCI6MTc1OTI2ODc1NH0.527ScMeRSW7LapAN57r6CmYUmpyaEjNqOTIhd0c_bRU`,
          },
        }),
      );
      return new User(data.id, data.name, data.email);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }
}
