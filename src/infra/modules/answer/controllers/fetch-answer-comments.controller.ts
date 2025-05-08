import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CommentWithAuthorPresenter } from "@/infra/http/presenters/comment-with-author-presenter";

import { FetchAnswerCommentsService } from "../services/fetch-answer-comments.service";

const pageQueryParamsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .default(1);

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>;

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerComments: FetchAnswerCommentsService,
  ) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParams,
    @Param("answerId") answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return {
      comments: comments.map(CommentWithAuthorPresenter.toHTTPResponse),
    };
  }
}
