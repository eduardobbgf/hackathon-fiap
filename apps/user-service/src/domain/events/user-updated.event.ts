import { DomainEvent } from '@app/shared';

export class UserUpdatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly changes: Record<string, any>
  ) {
    super(userId);
  }

  getEventName(): string {
    return 'user.updated';
  }
}
