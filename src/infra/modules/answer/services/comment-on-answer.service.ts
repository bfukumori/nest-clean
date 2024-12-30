import { Injectable } from "@nestjs/common";

import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";

@Injectable()
export class CommentOnAnswerService extends CommentOnAnswerUseCase {
  constructor(
    readonly answerRepository: AnswersRepository,
    readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {
    super(answerRepository, answerCommentsRepository);
  }
}
