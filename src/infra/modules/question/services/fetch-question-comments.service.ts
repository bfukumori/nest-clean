import { Injectable } from "@nestjs/common";

import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";

@Injectable()
export class FetchQuestionCommentsService extends FetchQuestionCommentsUseCase {
  constructor(readonly questionCommentsRepository: QuestionCommentsRepository) {
    super(questionCommentsRepository);
  }
}
