import { Module } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";

import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";

@Module({
  controllers: [CreateQuestionController, FetchRecentQuestionsController],
  providers: [PrismaService],
})
export class QuestionModule {}
