import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { PrismaAnswerMapper } from "@/infra/modules/database/prisma/mappers/prisma-answer-mapper";
import { PrismaService } from "@/infra/modules/database/prisma/prisma.service";

export function makeAnswer(
  override?: Partial<AnswerProps>,
  id?: UniqueEntityID,
): Answer {
  const answer = Answer.create(
    {
      questionId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prismaService.answer.create({
      data: PrismaAnswerMapper.toPersistence(answer),
    });

    return answer;
  }
}
