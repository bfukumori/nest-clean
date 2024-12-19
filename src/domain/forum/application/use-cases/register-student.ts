import { type Either, left, right } from "@/core/either";

import { Student } from "../../enterprise/entities/student";
import { HashGenerator } from "../cryptography/hash-generator";
import { type StudentsRepository } from "../repositories/students-repository";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

export class RegisterStudentUseCase {
  constructor(
    readonly studentsRepository: StudentsRepository,
    readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const userWithSameEmail = await this.studentsRepository.findByEmail(email);

    if (userWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({
      email,
      name,
      password: hashedPassword,
    });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
