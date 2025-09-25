import { BaseEntity } from './base-entity';
import { DomainEvent } from './domain-event';

export abstract class BaseAggregate extends BaseEntity {
  private _domainEvents: DomainEvent[] = [];

  constructor(id?: string) {
    super(id);
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public getUncommittedEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  public markEventsAsCommitted(): void {
    this._domainEvents = [];
  }
}
