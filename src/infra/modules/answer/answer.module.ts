import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/database/database.module";

import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CreateAnswerController } from "./controllers/create-answer.controller";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controller";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { FetchAnswerCommentsController } from "./controllers/fetch-answer-comments.controller";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { ChooseQuestionBestAnswerService } from "./services/choose-question-best-answer.service";
import { CommentOnAnswerService } from "./services/comment-on-answer.service";
import { CreateAnswerService } from "./services/create-answer.service";
import { DeleteAnswerService } from "./services/delete-answer.service";
import { DeleteAnswerCommentService } from "./services/delete-answer-comment.service";
import { EditAnswerService } from "./services/edit-answer.service";
import { FetchAnswerCommentsService } from "./services/fetch-answer-comments.service";
import { FetchQuestionAnswersService } from "./services/fetch-question-answers.service";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAnswerController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
    FetchAnswerCommentsController,
  ],
  providers: [
    CreateAnswerService,
    EditAnswerService,
    DeleteAnswerService,
    FetchQuestionAnswersService,
    ChooseQuestionBestAnswerService,
    CommentOnAnswerService,
    DeleteAnswerCommentService,
    FetchAnswerCommentsService,
  ],
})
export class AnswerModule {}
