import { BadRequestException, Controller, Get, Param } from "@nestjs/common";

import { QuestionDetailsPresenter } from "@/infra/modules/http/presenters/question-details-presenter";

import { GetQuestionBySlugService } from "../services/get-question-by-slug.service";

@Controller("/questions/:slug")
export class GetQuestionBySlugController {
  constructor(private readonly getQuestionBySlug: GetQuestionBySlugService) {}

  @Get()
  async handle(
    @Param("slug")
    slug: string,
  ) {
    const result = await this.getQuestionBySlug.execute({ slug });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const question = result.value.question;

    return { question: QuestionDetailsPresenter.toHTTPResponse(question) };
  }
}
