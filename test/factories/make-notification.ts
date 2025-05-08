import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";

export function makeNotification(
  override?: Partial<NotificationProps>,
  id?: UniqueEntityID,
): Notification {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(4),
      recipientId: new UniqueEntityID(),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );

  return notification;
}
