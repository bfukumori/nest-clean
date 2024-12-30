import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create question (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    prismaService = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "New question",
        content: "Question content",
      });

    expect(response.status).toBe(201);

    const questionOnDatabase = await prismaService.question.findFirst({
      where: {
        title: "New question",
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });
});
