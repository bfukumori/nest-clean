import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20;

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const questionComment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!questionComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(questionComment);
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const questionComments = await this.prisma.comment.findMany({
      where: { answerId },
      orderBy: {
        createdAt: "desc",
      },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    return questionComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id },
    });
  }
}
