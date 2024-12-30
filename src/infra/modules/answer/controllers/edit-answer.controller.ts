import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";

import { EditAnswerService } from "../../answer/services/edit-answer.service";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerService) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBody,
    @CurrentUser() user: UserPayload,
    @Param("id") answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: [],
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
