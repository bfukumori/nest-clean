import { Injectable } from "@nestjs/common";

import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";

@Injectable()
export class AuthenticateStudentService extends AuthenticateStudentUseCase {
  constructor(
    readonly studentsRepository: StudentsRepository,
    readonly hashComparer: HashComparer,
    readonly encrypter: Encrypter,
  ) {
    super(studentsRepository, hashComparer, encrypter);
  }
}
