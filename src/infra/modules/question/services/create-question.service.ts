import { Injectable } from "@nestjs/common";

import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

@Injectable()
export class CreateQuestionService extends CreateQuestionUseCase {
  constructor(readonly questionRepository: QuestionsRepository) {
    super(questionRepository);
  }
}
