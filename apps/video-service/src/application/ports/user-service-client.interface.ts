import { User } from "apps/user-service/src/domain";
import { UUID } from "crypto";

export interface IUserServiceClient {
  findUserById(userId: string, token: string): Promise<User | null>;
  // Métodos adicionais, como findUserByEmail, se necessário
}
