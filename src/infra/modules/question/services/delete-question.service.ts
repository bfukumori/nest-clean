import { Injectable } from "@nestjs/common";

import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";

@Injectable()
export class DeleteQuestionService extends DeleteQuestionUseCase {
  constructor(readonly questionRepository: QuestionsRepository) {
    super(questionRepository);
  }
}
