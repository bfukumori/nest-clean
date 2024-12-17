import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { z } from "zod";

import { CurrentUser } from "@/modules/auth/current-user.decorator";
import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { UserPayload } from "@/modules/auth/jwt-strategy";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
export class CreateQuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(
    @Body() body: CreateQuestionBody,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;

    await this.prismaService.question.create({
      data: {
        title,
        content,
        slug: title.toLowerCase().replace(/ /g, "-"),
        authorId: user.sub,
      },
    });
  }
}
