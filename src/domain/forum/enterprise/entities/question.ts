import dayjs from "dayjs";

import { AggregateRoot } from "@/core/entities/aggregate-root";
import { type UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type Optional } from "@/core/types/optional";

import { QuestionBestAnswerChosenEvent } from "../events/question-best-answer-chosen-event";
import { QuestionAttachmentList } from "./question-attachment-list";
import { Slug } from "./value-objects/slug";

export interface QuestionProps {
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID | null;
  title: string;
  content: string;
  slug: Slug;
  attachments?: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}
export class Question extends AggregateRoot<QuestionProps> {
  get content(): string {
    return this._props.content;
  }

  set content(content: string) {
    this._props.content = content;
    this.touch();
  }

  get title(): string {
    return this._props.title;
  }

  set title(title: string) {
    this._props.title = title;
    this._props.slug = Slug.createFromText(title);
    this.touch();
  }

  get slug(): Slug {
    return this._props.slug;
  }

  get authorId(): UniqueEntityID {
    return this._props.authorId;
  }

  get bestAnswerId(): UniqueEntityID | undefined | null {
    return this._props.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (
      bestAnswerId !== undefined &&
      bestAnswerId !== this._props.bestAnswerId
    ) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }
    this._props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  get attachments(): QuestionAttachmentList | undefined {
    return this._props.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this._props.attachments = attachments;
    this.touch();
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined | null {
    return this._props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  static create(
    props: Optional<QuestionProps, "createdAt" | "slug">,
    id?: UniqueEntityID,
  ): Question {
    const question = new Question(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    );

    return question;
  }
}
