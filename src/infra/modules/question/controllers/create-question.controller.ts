import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { CurrentUser } from "@/infra/modules/auth/current-user.decorator";
import { UserPayload } from "@/infra/modules/auth/jwt-strategy";
import { ZodValidationPipe } from "@/infra/modules/http/pipes/zod-validation.pipe";

import { CreateQuestionService } from "../services/create-question.service";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(
    @Body() body: CreateQuestionBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content, attachments } = body;

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
