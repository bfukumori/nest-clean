import { Injectable } from "@nestjs/common";

import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { CacheRepository } from "@/infra/modules/cache/cache-repository";

import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20;

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheRepository: CacheRepository,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    });

    return question ? PrismaQuestionMapper.toDomain(question) : null;
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);
      return PrismaQuestionDetailsMapper.toDomain(cachedData);
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(question),
    );

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    return questionDetails;
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);

    await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentsRepository.createMany(
      question.attachments?.getItems() || [],
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(questionId: string): Promise<void> {
    await this.prisma.question.delete({
      where: { id: questionId },
    });
  }

  async update(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPersistence(question);

    await Promise.all([
      this.prisma.question.update({
        where: { id: data.id },
        data,
      }),

      this.questionAttachmentsRepository.createMany(
        question.attachments?.getNewItems() || [],
      ),

      this.questionAttachmentsRepository.deleteMany(
        question.attachments?.getRemovedItems() || [],
      ),
      this.cacheRepository.delete(`question:${data.slug}:details`),
    ]);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
