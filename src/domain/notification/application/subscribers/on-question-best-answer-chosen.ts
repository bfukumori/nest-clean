import { Injectable } from "@nestjs/common";

import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

import { SendNotificationUseCase } from "../use-cases/send-notification";

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      (event) =>
        this.onQuestionBestAnswerChosenNotification(
          event as QuestionBestAnswerChosenEvent,
        ),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async onQuestionBestAnswerChosenNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent): Promise<void> {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer !== null) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: "Sua resposta foi escolhida",
        content: `A resposta que você enviou em "${question.title
          .substring(0, 20)
          .concat("...")}" foi escolhida pelo autor!`,
      });
    }
  }
}
