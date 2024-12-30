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

import { DeleteAnswerService } from "../../answer/services/delete-answer.service";

@Controller("/answers/:id")
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerService) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
