import { Either, right } from "@/core/either";

import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface FetchAnswerCommentsUseCaseRequest {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

export class FetchAnswerCommentsUseCase {
  constructor(
    protected readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({ comments });
  }
}
