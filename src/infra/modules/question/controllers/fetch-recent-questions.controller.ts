import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { QuestionPresenter } from "@/infra/http/presenters/question-presenter";

import { FetchRecentQuestionsService } from "../services/fetch-recent-questions.service";

const pageQueryParamsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .default(1);

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestions: FetchRecentQuestionsService,
  ) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParams,
  ) {
    const result = await this.fetchRecentQuestions.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questions = result.value.questions;

    return { questions: questions.map(QuestionPresenter.toHTTPResponse) };
  }
}
