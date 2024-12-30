import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CommentPresenter } from "@/infra/http/presenters/comment-presenter";

import { FetchQuestionCommentsService } from "../services/fetch-question-comments.service";

const pageQueryParamsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .default(1);

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsService,
  ) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParams,
    @Param("questionId") questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questionComments = result.value.questionComments;

    return {
      questionComments: questionComments.map(CommentPresenter.toHTTPResponse),
    };
  }
}
