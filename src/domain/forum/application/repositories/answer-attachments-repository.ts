import { type AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export interface AnswerAttachmentsRepository {
  findManyByAnswerId: (quesitonId: string) => Promise<AnswerAttachment[]>;
  deleteManyByAnswerId: (quesitonId: string) => Promise<void>;
}
