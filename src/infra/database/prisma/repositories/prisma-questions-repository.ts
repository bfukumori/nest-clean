import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { PrismaService } from "../prisma.service";

const PER_PAGE = 20;

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    });

    return question ? PrismaQuestionMapper.toDomain(question) : null;
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
    ]);
  }
}
