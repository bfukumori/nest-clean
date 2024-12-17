import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type Question } from "@/domain/forum/enterprise/entities/question";

export interface QuestionsRepository {
  findBySlug: (slug: string) => Promise<Question | null>;
  findById: (id: string) => Promise<Question | null>;
  findManyRecent: ({ page }: PaginationParams) => Promise<Question[]>;
  create: (question: Question) => Promise<void>;
  delete: (questionId: string) => Promise<void>;
  update: (question: Question) => Promise<void>;
}
