import { Entity } from "@/core/entities/entity";
import { type UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface AnswerAttachmentProps {
  answerId: UniqueEntityID;
  attachmentId: UniqueEntityID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId(): UniqueEntityID {
    return this._props.answerId;
  }

  get attachmentId(): UniqueEntityID {
    return this._props.attachmentId;
  }

  static create(
    props: AnswerAttachmentProps,
    id?: UniqueEntityID,
  ): AnswerAttachment {
    const attachment = new AnswerAttachment(props, id);

    return attachment;
  }
}
