import { Entity } from "@/core/entities/entity";
import { type UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CommentProps {
  authorId: UniqueEntityID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
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

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  private touch(): void {
    this._props.updatedAt = new Date();
  }
}
