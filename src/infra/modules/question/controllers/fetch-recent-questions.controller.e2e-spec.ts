import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Get questions (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /questions", async () => {
    const user = await prismaService.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwtService.sign({ sub: user.id });

    await prismaService.question.createMany({
      data: [
        {
          title: "Question 1",
          slug: "question-1",
          content: "Question content",
          authorId: user.id,
        },
        {
          title: "Question 2",
          slug: "question-2",
          content: "Question content",
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New question",
        content: "Question content",
      });

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      questions: [
        expect.objectContaining({ title: "Question 1" }),
        expect.objectContaining({ title: "Question 2" }),
      ],
    });
  });
});
