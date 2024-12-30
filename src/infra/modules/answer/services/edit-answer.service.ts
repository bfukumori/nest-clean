import { Injectable } from "@nestjs/common";

import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

@Injectable()
export class EditAnswerService extends EditAnswerUseCase {
  constructor(
    readonly answerRepository: AnswersRepository,
    readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {
    super(answerRepository, answerAttachmentsRepository);
  }
}
