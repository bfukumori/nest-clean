import { Module } from "@nestjs/common";

import { AccountModule } from "../account/account.module";
import { AnswerModule } from "../answer/answer.module";
import { UploadAttachmentModule } from "../attachment/uplload-attachment.module";
import { QuestionModule } from "../question/question.module";

@Module({
  imports: [
    AccountModule,
    QuestionModule,
    AnswerModule,
    UploadAttachmentModule,
  ],
})
export class HttpModule {}
