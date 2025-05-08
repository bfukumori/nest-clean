import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/modules/http/pipes/zod-validation.pipe";
import { AnswerPresenter } from "@/infra/modules/http/presenters/answer-presenter";

import { FetchQuestionAnswersService } from "../services/fetch-question-answers.service";

const pageQueryParamsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .default(1);

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswers: FetchQuestionAnswersService,
  ) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    @Param("questionId")
    page: PageQueryParams,
    questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return { answers: answers.map(AnswerPresenter.toHTTPResponse) };
  }
}
