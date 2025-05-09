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

import { CreateAnswerService } from "../../answer/services/create-answer.service";

const createAnswerBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type CreateAnswerBody = z.infer<typeof createAnswerBodySchema>;

@Controller("/questions/:questionId/answers")
export class CreateAnswerController {
  constructor(private readonly createAnswer: CreateAnswerService) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createAnswerBodySchema)) body: CreateAnswerBody,
    @CurrentUser() user: UserPayload,
    @Param("questionId") questionId: string,
  ) {
    const { content, attachments } = body;

    const result = await this.createAnswer.execute({
      content,
      authorId: user.sub,
      questionId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
