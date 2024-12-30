import { Injectable } from "@nestjs/common";

import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";

@Injectable()
export class CommentOnQuestionService extends CommentOnQuestionUseCase {
  constructor(
    readonly questionRepository: QuestionsRepository,
    readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {
    super(questionRepository, questionCommentsRepository);
  }
}
