import { Injectable } from "@nestjs/common";

import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";

@Injectable()
export class FetchQuestionAnswersService extends FetchQuestionAnswersUseCase {
  constructor(readonly answersRepository: AnswersRepository) {
    super(answersRepository);
  }
}
