import { Injectable } from "@nestjs/common";

import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";

@Injectable()
export class FetchAnswerCommentsService extends FetchAnswerCommentsUseCase {
  constructor(readonly answerCommentsRepository: AnswerCommentsRepository) {
    super(answerCommentsRepository);
  }
}
