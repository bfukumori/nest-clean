import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Get question by slug (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: "Question 1",
      slug: Slug.create("question-1"),
    });

    const response = await request(app.getHttpServer())
      .get("/questions/question-1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      question: expect.objectContaining({
        title: "Question 1",
      }),
    });
  });
});
