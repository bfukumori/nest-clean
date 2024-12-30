import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from "@nestjs/common";

import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";

import { DeleteAnswerCommentService } from "../services/delete-answer-comment.service";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerComment: DeleteAnswerCommentService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") answerCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
