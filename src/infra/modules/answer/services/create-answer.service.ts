import { Injectable } from "@nestjs/common";

import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";

@Injectable()
export class CreateAnswerService extends AnswerQuestionUseCase {
  constructor(readonly answerRepository: AnswersRepository) {
    super(answerRepository);
  }
}
