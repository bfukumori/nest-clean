import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Student,
  StudentProps,
} from "@/domain/forum/enterprise/entities/student";
import { PrismaStudentMapper } from "@/infra/modules/database/prisma/mappers/prisma-student-mapper";
import { PrismaService } from "@/infra/modules/database/prisma/prisma.service";

export function makeStudent(
  override?: Partial<StudentProps>,
  id?: UniqueEntityID,
): Student {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return student;
}

@Injectable()
export class StudentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data);

    await this.prismaService.user.create({
      data: PrismaStudentMapper.toPersistence(student),
    });

    return student;
  }
}
