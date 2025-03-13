import { Entity } from "@/core/entities/entity";
import { type UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string {
    return this._props.title;
  }

  get url(): string {
    return this._props.url;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID): Attachment {
    const attachment = new Attachment(props, id);

    return attachment;
  }
}
