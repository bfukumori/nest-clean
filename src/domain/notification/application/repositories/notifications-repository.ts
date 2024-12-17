import { type Notification } from "@/domain/notification/enterprise/entities/notification";

export interface NotificationsRepository {
  create: (notification: Notification) => Promise<void>;
  update: (notification: Notification) => Promise<void>;
  findById: (id: string) => Promise<Notification | null>;
}
