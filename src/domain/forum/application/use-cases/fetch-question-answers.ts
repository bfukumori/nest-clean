import { type Either, right } from "@/core/either";
import { type Answer } from "@/domain/forum/enterprise/entities/answer";

import { type AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    );

    return right({ answers });
  }
}
