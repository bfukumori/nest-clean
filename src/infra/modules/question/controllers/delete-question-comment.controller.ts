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

import { DeleteQuestionCommentService } from "../services/delete-question-comment.service";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
  constructor(
    private readonly deleteQuestionComment: DeleteQuestionCommentService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") questionCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
