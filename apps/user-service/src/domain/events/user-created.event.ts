import { DomainEvent } from '@app/shared';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string
  ) {
    super(userId);
  }

  getEventName(): string {
    return 'user.created';
  }
}
