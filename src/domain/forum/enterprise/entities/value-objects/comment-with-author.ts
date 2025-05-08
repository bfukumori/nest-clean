import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";

export interface CommentWithAuthorProps {
  commentId: UniqueEntityID;
  authorId: UniqueEntityID;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get commentId(): UniqueEntityID {
    return this.props.commentId;
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId;
  }

  get author(): string {
    return this.props.author;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  static create(props: CommentWithAuthorProps): CommentWithAuthor {
    return new CommentWithAuthor(props);
  }
}
