import { Injectable } from "@nestjs/common";

import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: { questionId },
    });

    return questionAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: { questionId },
    });
  }
}
