import { Injectable } from "@nestjs/common";

import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

@Injectable()
export class DeleteQuestionCommentService extends DeleteQuestionCommentUseCase {
  constructor(questionCommentsRepository: QuestionCommentsRepository) {
    super(questionCommentsRepository);
  }
}
