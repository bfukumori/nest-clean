import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/database/database.module";

import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { CreateQuestionService } from "./services/create-question.service";
import { FetchRecentQuestionsService } from "./services/fetch-recent-questions.service";

@Module({
  imports: [DatabaseModule],
  controllers: [CreateQuestionController, FetchRecentQuestionsController],
  providers: [CreateQuestionService, FetchRecentQuestionsService],
})
export class QuestionModule {}
