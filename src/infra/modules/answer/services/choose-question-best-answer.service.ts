import { Injectable } from "@nestjs/common";

import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";

@Injectable()
export class ChooseQuestionBestAnswerService extends ChooseQuestionBestAnswerUseCase {
  constructor(
    readonly questionRepository: QuestionsRepository,
    readonly answerRepository: AnswersRepository,
  ) {
    super(questionRepository, answerRepository);
  }
}
