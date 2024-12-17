import { type QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export interface QuestionAttachmentsRepository {
  findManyByQuestionId: (quesitonId: string) => Promise<QuestionAttachment[]>;
  deleteManyByQuestionId: (quesitonId: string) => Promise<void>;
}
