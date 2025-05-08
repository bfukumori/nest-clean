import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";
import { beforeAll, describe, expect, it } from "vitest";

import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { CacheModule } from "@/infra/modules/cache/cache.module";
import { CacheRepository } from "@/infra/modules/cache/cache-repository";

import { DatabaseModule } from "../../database.module";

describe("Prisma Questions Repository (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionsRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionsRepository);

    await app.init();
  });

  it("should cache question details", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create("question-1"),
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    if (!cached) {
      throw new Error("Cache not set correctly");
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    );
  });

  it("should return cached question details on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    let cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();

    await questionsRepository.findDetailsBySlug(slug);

    cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).not.toBeNull();

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    if (!cached) {
      throw new Error("Cache not set correctly");
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    );
  });

  it("should reset question details cache when saving the question", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create("question-2"),
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionsRepository.update(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
