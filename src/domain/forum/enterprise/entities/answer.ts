import { AggregateRoot } from "@/core/entities/aggregate-root";
import { type UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type Optional } from "@/core/types/optional";

import { AnswerCreatedEvent } from "../events/answer-created-event";
import { AnswerAttachmentList } from "./answer-attachment-list";

export interface AnswerProps {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  attachments?: AnswerAttachmentList;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
export class Answer extends AggregateRoot<AnswerProps> {
  get content(): string {
    return this._props.content;
  }

  set content(content: string) {
    this._props.content = content;
    this.touch();
  }

  get authorId(): UniqueEntityID {
    return this._props.authorId;
  }

  get questionId(): UniqueEntityID {
    return this._props.questionId;
  }

  get attachments(): AnswerAttachmentList | undefined {
    return this._props.attachments;
  }

  set attachments(attachments: AnswerAttachmentList) {
    this._props.attachments = attachments;
    this.touch();
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }

  static create(
    props: Optional<AnswerProps, "createdAt">,
    id?: UniqueEntityID,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = id === undefined;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
