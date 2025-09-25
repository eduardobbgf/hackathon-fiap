import { BaseEntity, Validators } from '@app/shared';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export class User extends BaseEntity {
  private _name: string;
  private _email: Email;
  private _password: Password;
  private _status: UserStatus;

  constructor(
    name: string,
    email: Email,
    password: Password,
    id?: string,
    status: UserStatus = UserStatus.ACTIVE
  ) {
    super(id);
    this.setName(name);
    this._email = email;
    this._password = password;
    this._status = status;
  }

  private setName(name: string): void {
    Validators.isNotEmpty(name, 'Name');
    Validators.hasMinLength(name, 2, 'Name');
    Validators.hasMaxLength(name, 100, 'Name');
    this._name = name.trim();
  }

  public updateName(name: string): void {
    this.setName(name);
    this.touch();
  }

  public updateEmail(email: Email): void {
    this._email = email;
    this.touch();
  }

  public async updatePassword(newPassword: string): Promise<void> {
    this._password = await Password.create(newPassword);
    this.touch();
  }

  public activate(): void {
    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  public deactivate(): void {
    this._status = UserStatus.INACTIVE;
    this.touch();
  }

  public suspend(): void {
    this._status = UserStatus.SUSPENDED;
    this.touch();
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return this._password.compare(plainPassword);
  }

  public isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  // Getters
  public get name(): string {
    return this._name;
  }

  public get email(): Email {
    return this._email;
  }

  public get password(): Password {
    return this._password;
  }

  public get status(): UserStatus {
    return this._status;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this._name,
      email: this._email.value,
      status: this._status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
