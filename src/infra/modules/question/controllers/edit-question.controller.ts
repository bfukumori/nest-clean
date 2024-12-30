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

import { EditQuestionService } from "../services/edit-question.service";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionService) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema)) body: EditQuestionBody,
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
