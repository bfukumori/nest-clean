import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";
import { ZodValidationPipe } from "@/infra/modules/http/pipes/zod-validation.pipe";

import { CommentOnAnswerService } from "../../answer/services/comment-on-answer.service";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBody = z.infer<typeof commentOnAnswerBodySchema>;

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema))
    body: CommentOnAnswerBody,
    @CurrentUser() user: UserPayload,
    @Param("answerId") answerId: string,
  ) {
    const { content } = body;

    const result = await this.commentOnAnswer.execute({
      content,
      authorId: user.sub,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
