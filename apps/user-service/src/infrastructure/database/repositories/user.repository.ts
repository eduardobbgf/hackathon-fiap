import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserRepository, User, Email, UserStatus } from "../../../domain";
import { Password } from "../../../domain/value-objects/password.vo";
import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<User[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const existingEntity = await this.repository.findOne({ where: { id } });
    if (!existingEntity) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedEntity = { ...existingEntity, ...this.toEntity(user as User) };
    const savedEntity = await this.repository.save(updatedEntity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.repository.findOne({
      where: { email: email.value },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.repository.count({
      where: { email: email.value },
    });
    return count > 0;
  }

  async findActiveUsers(): Promise<User[]> {
    const entities = await this.repository.find({
      where: { status: "active" },
    });
    return entities.map((entity) => this.toDomain(entity));
  }

  private toDomain(entity: UserEntity): User {
    const email = new Email(entity.email);
    const password = Password.fromHash(entity.password);

    const user = new User(
      entity.name,
      email,
      password,
      entity.id,
      entity.status as UserStatus,
    );

    // Definir as datas manualmente pois o construtor cria novas datas
    (user as any).createdAt = entity.createdAt;
    (user as any).updatedAt = entity.updatedAt;

    return user;
  }

  private toEntity(user: User): Partial<UserEntity> {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      password: user.password.hashedValue,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
