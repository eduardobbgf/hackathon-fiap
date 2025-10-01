import { UUID } from "crypto";
import { User } from "../../domain/entities/user.entity";

export interface IUserServiceClient {
  findUserById(userId: string): Promise<User | null>;
}
