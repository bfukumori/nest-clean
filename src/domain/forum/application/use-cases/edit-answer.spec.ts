import { makeAnswer } from "test/factories/make-answer";
import { makeAnswerAttachment } from "test/factories/make-answer-attachment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { beforeEach, describe, expect, it } from "vitest";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";

import { EditAnswerUseCase } from "./edit-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("Edit answer", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository,
    );
  });

  it("should be able to edit an answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: newAnswer.authorId.toValue(),
      content: "content-1",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "content-1",
    });
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("author-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      answerId: "answer-1",
      authorId: "author-2",
      content: "content-1",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it("should be sync new and removed attachments when editing an answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("question-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID("2"),
      }),
    );

    const result = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: newAnswer.authorId.toValue(),
      content: "content-2",
      attachmentsIds: ["1", "3"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
        expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
      ]),
    );
  });
});
