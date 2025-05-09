import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { z } from "zod";

import { WrongCredentialsError } from "@/domain/forum/application/use-cases/errors/wrong-credentials-error";
import { ZodValidationPipe } from "@/infra/modules/http/pipes/zod-validation.pipe";

import { Public } from "./public";
import { AuthenticateStudentService } from "./services/authenticate-student.service";

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthBodyDTO = z.infer<typeof authBodySchema>;

@Controller("sessions")
@Public()
export class AuthController {
  constructor(
    private readonly authenticateStudent: AuthenticateStudentService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: AuthBodyDTO) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
