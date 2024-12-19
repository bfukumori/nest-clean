import { Entity } from "@/core/entities/entity";
import { type UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface StudentProps {
  name: string;
  email: string;
  password: string;
}

export class Student extends Entity<StudentProps> {
  get name(): string {
    return this._props.name;
  }

  get email(): string {
    return this._props.email;
  }

  get password(): string {
    return this._props.password;
  }

  static create(props: StudentProps, id?: UniqueEntityID): Student {
    const student = new Student(props, id);

    return student;
  }
}
