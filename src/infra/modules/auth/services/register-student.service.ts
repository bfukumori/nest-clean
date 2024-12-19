import { Injectable } from "@nestjs/common";

import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";

@Injectable()
export class RegisterStudentService extends RegisterStudentUseCase {
  constructor(
    readonly studentsRepository: StudentsRepository,
    readonly hashGenerator: HashGenerator,
  ) {
    super(studentsRepository, hashGenerator);
  }
}
