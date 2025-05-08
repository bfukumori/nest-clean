import { describe, expect, it, vi } from "vitest";

import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date;

  constructor(private readonly aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create(): CustomAggregate {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe("domain events", () => {
  it("should be able to dispatch and listen to events", () => {
    const callbackSpy = vi.fn();

    // Subscriber cadastrado (ouvindo o evento)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Criar evento
    const aggregate = CustomAggregate.create();

    // Garantir que evento foi criado, porém não disparado
    expect(aggregate.domainEvents).toHaveLength(1);

    // Disparar o evento após salvar no banco
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // Garantir que o subscriber escutou o evento e excutou a ação
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
