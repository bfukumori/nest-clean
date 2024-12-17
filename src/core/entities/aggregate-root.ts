import { type DomainEvent } from "@/core/events/domain-event";
import { DomainEvents } from "@/core/events/domain-events";

import { Entity } from "./entity";

export abstract class AggregateRoot<Props> extends Entity<Props> {
  #domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this.#domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.#domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents(): void {
    this.#domainEvents = [];
  }
}
