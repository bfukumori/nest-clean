import { DomainEvents } from "@/core/events/domain-events";
import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { type QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { type Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (question === null || question === undefined) {
      return null;
    }

    return question;
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = this.items.find(
      (item) => item.id.toString() === questionId,
    );

    if (question === null || question === undefined) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async create(question: Question): Promise<void> {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(questionId: string): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toString() === questionId,
    );

    this.items.splice(questionIndex, 1);
    await this.questionAttachmentsRepository.deleteManyByQuestionId(questionId);
  }

  async update(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    );

    this.items[questionIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
