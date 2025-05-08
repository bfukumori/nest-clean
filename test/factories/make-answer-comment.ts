import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  type AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/modules/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/modules/database/prisma/prisma.service";

export function makeAnswerComment(
  override?: Partial<AnswerCommentProps>,
  id?: UniqueEntityID,
): AnswerComment {
  const answercomment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answercomment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswerComment(
    data: Partial<AnswerCommentProps> = {},
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data);

    await this.prismaService.comment.create({
      data: PrismaAnswerCommentMapper.toPersistence(answerComment),
    });

    return answerComment;
  }
}
