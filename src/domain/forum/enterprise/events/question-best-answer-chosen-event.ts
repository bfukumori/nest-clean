import { type UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type DomainEvent } from "@/core/events/domain-event";

import { type Question } from "../entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(
    public readonly question: Question,
    public readonly bestAnswerId: UniqueEntityID,
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
