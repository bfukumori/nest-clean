import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/modules/http/pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";

import { CommentOnQuestionService } from "../services/comment-on-question.service";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema))
    body: CommentOnQuestionBody,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string,
  ) {
    const { content } = body;

    const result = await this.commentOnQuestion.execute({
      content,
      authorId: user.sub,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
