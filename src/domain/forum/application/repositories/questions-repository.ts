import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "@/domain/forum/enterprise/entities/question";

import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
  abstract findById(id: string): Promise<Question | null>;
  abstract findManyRecent({ page }: PaginationParams): Promise<Question[]>;
  abstract create(question: Question): Promise<void>;
  abstract delete(questionId: string): Promise<void>;
  abstract update(question: Question): Promise<void>;
}
