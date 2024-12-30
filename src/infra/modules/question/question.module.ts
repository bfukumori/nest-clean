import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/database/database.module";

import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { FetchQuestionCommentsController } from "./controllers/fetch-question-comments.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { CommentOnQuestionService } from "./services/comment-on-question.service";
import { CreateQuestionService } from "./services/create-question.service";
import { DeleteQuestionService } from "./services/delete-question.service";
import { DeleteQuestionCommentService } from "./services/delete-question-comment.service";
import { EditQuestionService } from "./services/edit-question.service";
import { FetchQuestionCommentsService } from "./services/fetch-question-comments.service";
import { FetchRecentQuestionsService } from "./services/fetch-recent-questions.service";
import { GetQuestionBySlugService } from "./services/get-question-by-slug.service";

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    FetchQuestionCommentsController,
  ],
  providers: [
    CreateQuestionService,
    FetchRecentQuestionsService,
    GetQuestionBySlugService,
    EditQuestionService,
    DeleteQuestionService,
    CommentOnQuestionService,
    DeleteQuestionCommentService,
    FetchQuestionCommentsService,
  ],
})
export class QuestionModule {}
