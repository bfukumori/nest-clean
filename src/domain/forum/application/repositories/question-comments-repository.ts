import { type PaginationParams } from "@/core/repositories/pagination-params";
import { type QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

import { type CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
