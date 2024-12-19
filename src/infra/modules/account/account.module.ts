import { Module } from "@nestjs/common";

import { CryptographyModule } from "@/infra/crytography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";

import { RegisterStudentService } from "../auth/services/register-student.service";
import { CreateAccountController } from "./controllers/create-account.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterStudentService],
})
export class AccountModule {}
