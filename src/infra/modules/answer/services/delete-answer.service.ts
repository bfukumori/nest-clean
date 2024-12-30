import { Injectable } from "@nestjs/common";

import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";

@Injectable()
export class DeleteAnswerService extends DeleteAnswerUseCase {
  constructor(readonly answerRepository: AnswersRepository) {
    super(answerRepository);
  }
}
