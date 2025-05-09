import { Injectable } from "@nestjs/common";

import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20;

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments?.getItems() || [],
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    });

    return answer ? PrismaAnswerMapper.toDomain(answer) : null;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: {
        createdAt: "desc",
      },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async delete(answerId: string): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answerId },
    });
  }

  async update(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPersistence(answer);

    await Promise.all([
      this.prisma.answer.update({
        where: { id: data.id },
        data,
      }),

      this.answerAttachmentsRepository.createMany(
        answer.attachments?.getNewItems() || [],
      ),

      this.answerAttachmentsRepository.deleteMany(
        answer.attachments?.getRemovedItems() || [],
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
