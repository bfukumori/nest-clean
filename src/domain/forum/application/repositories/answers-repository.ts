import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type Answer } from "@/domain/forum/enterprise/entities/answer";

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]>;
  delete(answerId: string): Promise<void>;
  update(answer: Answer): Promise<void>;
}
