import { Module } from "@nestjs/common";

import { AccountModule } from "../modules/account/account.module";
import { QuestionModule } from "../modules/question/question.module";

@Module({
  imports: [AccountModule, QuestionModule],
})
export class HttpModule {}
