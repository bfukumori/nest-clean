import { Injectable } from "@nestjs/common";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";

import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) => this.sendNewAnswerNotification(event as AnswerCreatedEvent),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({
    answer,
  }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      answer.authorId.toString(),
    );

    if (question !== null) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .concat("...")}"`,
        content: answer.excerpt,
      });
    }
  }
}
