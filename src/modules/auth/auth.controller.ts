import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { z } from "zod";

import { ZodValidationPipe } from "@/pipes/zod-validation.pipe";
import { PrismaService } from "@/prisma/prisma.service";

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthBodyDTO = z.infer<typeof authBodySchema>;

@Controller("sessions")
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async handle(@Body() body: AuthBodyDTO) {
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
