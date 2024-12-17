import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { z } from "zod";

import { JwtAuthGuard } from "@/modules/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";

const PER_PAGE = 5;

const pageQueryParamsSchema = z.coerce
  .number()
  .int()
  .positive()
  .optional()
  .default(1);

type PageQueryParams = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParams,
  ) {
    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    return { questions };
  }
}
