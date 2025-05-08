import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "@/infra/modules/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/modules/database/prisma/prisma.service";

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

@Injectable()
export class NotificationFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prismaService.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
