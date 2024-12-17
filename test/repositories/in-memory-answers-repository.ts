import { DomainEvents } from "@/core/events/domain-events";
import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { type Answer } from "@/domain/forum/enterprise/entities/answer";

import { type InMemoryAnswerAttachmentsRepository } from "./in-memory-answer-attachments-repository";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private readonly inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
  ) {}

  async findById(answerId: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === answerId);

    if (answer === null || answer === undefined) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answerId: string): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answerId,
    );

    this.items.splice(answerIndex, 1);
    await this.inMemoryAnswerAttachmentsRepository.deleteManyByAnswerId(
      answerId,
    );
  }

  async update(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[answerIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
