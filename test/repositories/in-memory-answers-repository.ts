import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
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

    await this.answerAttachmentsRepository.createMany(
      answer.attachments?.getItems() || [],
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answerId: string): Promise<void> {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answerId,
    );

    this.items.splice(answerIndex, 1);
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answerId);
  }

  async update(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[answerIndex] = answer;

    await this.answerAttachmentsRepository.createMany(
      answer.attachments?.getNewItems() || [],
    );
    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments?.getRemovedItems() || [],
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
