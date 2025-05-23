import { Module } from "@nestjs/common";

import { DatabaseModule } from "@/infra/modules/database/database.module";

import { R2StorageModule } from "../storage/storage.module";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { UploadAndCreateAttachmentService } from "./services/upload-and-create-attachment.service";

@Module({
  imports: [DatabaseModule, R2StorageModule],
  controllers: [UploadAttachmentController],
  providers: [UploadAndCreateAttachmentService],
})
export class UploadAttachmentModule {}
