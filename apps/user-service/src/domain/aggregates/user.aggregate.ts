import { BaseAggregate } from '@app/shared';
import { User, UserStatus } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';

export class UserAggregate extends BaseAggregate {
  private _user: User;

  constructor(user: User) {
    super(user.id);
    this._user = user;
  }

  public static async create(
    name: string,
    email: Email,
    plainPassword: string
  ): Promise<UserAggregate> {
    const password = await Password.create(plainPassword);
    const user = new User(name, email, password);
    const aggregate = new UserAggregate(user);
    
    aggregate.addDomainEvent(
      new UserCreatedEvent(user.id, user.email.value, user.name)
    );
    
    return aggregate;
  }

  public updateName(name: string): void {
    const oldName = this._user.name;
    this._user.updateName(name);
    
    this.addDomainEvent(
      new UserUpdatedEvent(this._user.id, { name: { old: oldName, new: name } })
    );
    this.touch();
  }

  public updateEmail(email: Email): void {
    const oldEmail = this._user.email.value;
    this._user.updateEmail(email);
    
    this.addDomainEvent(
      new UserUpdatedEvent(this._user.id, { email: { old: oldEmail, new: email.value } })
    );
    this.touch();
  }

  public async updatePassword(newPassword: string): Promise<void> {
    await this._user.updatePassword(newPassword);
    
    this.addDomainEvent(
      new UserUpdatedEvent(this._user.id, { password: 'updated' })
    );
    this.touch();
  }

  public activate(): void {
    const oldStatus = this._user.status;
    this._user.activate();
    
    this.addDomainEvent(
      new UserUpdatedEvent(this._user.id, { status: { old: oldStatus, new: UserStatus.ACTIVE } })
    );
    this.touch();
  }

  public deactivate(): void {
    const oldStatus = this._user.status;
    this._user.deactivate();
    
    this.addDomainEvent(
      new UserUpdatedEvent(this._user.id, { status: { old: oldStatus, new: UserStatus.INACTIVE } })
    );
    this.touch();
  }

  public suspend(): void {
    const oldStatus = this._user.status;
    this._user.suspend();
    
    this.addDomainEvent(
      new UserUpdatedEvent(this._user.id, { status: { old: oldStatus, new: UserStatus.SUSPENDED } })
    );
    this.touch();
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return this._user.validatePassword(plainPassword);
  }

  public get user(): User {
    return this._user;
  }
}
