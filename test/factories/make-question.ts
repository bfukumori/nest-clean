import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Question,
  type QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeQuestion(
  override?: Partial<QuestionProps>,
  id?: UniqueEntityID,
): Question {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      slug: Slug.create("example-question"),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestion(
    data: Partial<QuestionProps> = {},
  ): Promise<Question> {
    const question = makeQuestion(data);

    await this.prismaService.question.create({
      data: PrismaQuestionMapper.toPersistence(question),
    });

    return question;
  }
}
