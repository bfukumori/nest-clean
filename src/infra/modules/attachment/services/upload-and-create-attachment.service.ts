import { Injectable } from "@nestjs/common";

import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Uploader } from "@/domain/forum/application/storage/uploader";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment";

@Injectable()
export class UploadAndCreateAttachmentService extends UploadAndCreateAttachmentUseCase {
  constructor(
    readonly attachmentsRepository: AttachmentsRepository,
    readonly uploader: Uploader,
  ) {
    super(attachmentsRepository, uploader);
  }
}
