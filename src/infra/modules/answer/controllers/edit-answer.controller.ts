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

import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";
import { ZodValidationPipe } from "@/infra/modules/http/pipes/zod-validation.pipe";

import { EditAnswerService } from "../../answer/services/edit-answer.service";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
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
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: attachments,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
