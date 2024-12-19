import { Injectable } from "@nestjs/common";

import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";

@Injectable()
export class FetchRecentQuestionsService extends FetchRecentQuestionsUseCase {
  constructor(readonly questionRepository: QuestionsRepository) {
    super(questionRepository);
  }
}
