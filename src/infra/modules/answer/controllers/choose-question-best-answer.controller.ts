import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from "@nestjs/common";

import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";

import { ChooseQuestionBestAnswerService } from "../../answer/services/choose-question-best-answer.service";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
  constructor(
    private readonly chooseQuestionBestAnswer: ChooseQuestionBestAnswerService,
  ) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param("answerId") answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswer.execute({
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
