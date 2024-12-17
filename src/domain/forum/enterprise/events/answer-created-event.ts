import { type UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type DomainEvent } from "@/core/events/domain-event";

import { type Answer } from "../entities/answer";

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public readonly answer: Answer) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
