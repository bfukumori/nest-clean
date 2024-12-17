import { type NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { type Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (notification === null || notification === undefined) {
      return null;
    }

    return notification;
  }

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async update(notification: Notification): Promise<void> {
    const notificationIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[notificationIndex] = notification;
  }
}
