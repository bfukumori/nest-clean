import { Module } from "@nestjs/common";

import { OnAnswerCreated } from "@/domain/notification/application/subscribers/on-answer-created";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/on-question-best-answer-chosen";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";

import { DatabaseModule } from "../database/database.module";
import { ReadNotificationController } from "./controllers/read-notification.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [ReadNotificationController],
  providers: [
    OnAnswerCreated,
    OnQuestionBestAnswerChosen,
    SendNotificationUseCase,
    ReadNotificationUseCase,
  ],
})
export class EventsModule {}
