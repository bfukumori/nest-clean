import { Injectable } from "@nestjs/common";

import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

@Injectable()
export class EditQuestionService extends EditQuestionUseCase {
  constructor(
    readonly questionRepository: QuestionsRepository,
    readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {
    super(questionRepository, questionAttachmentsRepository);
  }
}
