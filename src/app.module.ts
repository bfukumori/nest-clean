import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { envSchema } from "./env";
import { AccountModule } from "./modules/account/account.module";
import { AuthModule } from "./modules/auth/auth.module";
import { QuestionModule } from "./modules/question/question.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    QuestionModule,
  ],
})
export class AppModule {}
