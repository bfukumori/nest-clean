import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]>;
  abstract delete(answerId: string): Promise<void>;
  abstract update(answer: Answer): Promise<void>;
}
