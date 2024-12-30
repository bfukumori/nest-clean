import { Injectable } from "@nestjs/common";

import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";

@Injectable()
export class GetQuestionBySlugService extends GetQuestionBySlugUseCase {
  constructor(readonly questionRepository: QuestionsRepository) {
    super(questionRepository);
  }
}
