import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/modules/database/database.module";

describe("Get question answers (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id;

    await answerFactory.makePrismaAnswer({
      content: "Question answer 1",
      questionId: question.id,
      authorId: user.id,
    });

    await answerFactory.makePrismaAnswer({
      content: "Question answer 2",
      questionId: question.id,
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({ content: "Question answer 2" }),
        expect.objectContaining({ content: "Question answer 1" }),
      ]),
    });
  });
});
