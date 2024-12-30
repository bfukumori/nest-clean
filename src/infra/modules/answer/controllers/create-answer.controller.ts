import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";

import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";

import { CreateAnswerService } from "../../answer/services/create-answer.service";

const createAnswerBodySchema = z.object({
  content: z.string(),
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
    const { content } = body;

    const result = await this.createAnswer.execute({
      content,
      authorId: user.sub,
      questionId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
