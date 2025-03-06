import { Module } from "@nestjs/common";

import { AccountModule } from "../modules/account/account.module";
import { AnswerModule } from "../modules/answer/answer.module";
import { UploadAttachmentModule } from "../modules/attachment/uplload-attachment.module";
import { QuestionModule } from "../modules/question/question.module";

@Module({
  imports: [
    AccountModule,
    QuestionModule,
    AnswerModule,
    UploadAttachmentModule,
  ],
})
export class HttpModule {}
