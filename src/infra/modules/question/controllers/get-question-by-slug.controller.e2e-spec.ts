import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/modules/database/database.module";

describe("Get question by slug (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await studentFactory.makePrismaStudent({ name: "John Doe" });

    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: "Question 1",
      slug: Slug.create("question-1"),
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: "Attachment 1",
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .get("/questions/question-1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      question: expect.objectContaining({
        title: question.title,
        author: user.name,
        attachments: [
          expect.objectContaining({
            title: attachment.title,
            url: attachment.url,
          }),
        ],
      }),
    });
  });
});
