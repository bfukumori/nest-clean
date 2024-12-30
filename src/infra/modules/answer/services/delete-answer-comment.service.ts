import { Injectable } from "@nestjs/common";

import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Injectable()
export class DeleteAnswerCommentService extends DeleteAnswerCommentUseCase {
  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    super(answerCommentsRepository);
  }
}
