import { Notification } from "@/domain/notification/enterprise/entities/notification";

export abstract class NotificationsRepository {
  abstract create: (notification: Notification) => Promise<void>;
  abstract update: (notification: Notification) => Promise<void>;
  abstract findById: (id: string) => Promise<Notification | null>;
}
