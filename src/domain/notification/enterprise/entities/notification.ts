import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type Optional } from "@/core/types/optional";

export interface NotificationProps {
  recipientId: UniqueEntityID;
  title: string;
  content: string;
  createdAt: Date;
  readAt?: Date | null;
}

export class Notification extends Entity<NotificationProps> {
  get title(): string {
    return this._props.title;
  }

  get content(): string {
    return this._props.content;
  }

  get createdAt(): Date {
    return this._props.createdAt;
  }

  get readAt(): Date | undefined | null {
    return this._props.readAt;
  }

  read(): void {
    this._props.readAt = new Date();
  }

  get recipientId(): UniqueEntityID {
    return this._props.recipientId;
  }

  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityID,
  ): Notification {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new UniqueEntityID(),
    );

    return notification;
  }
}
