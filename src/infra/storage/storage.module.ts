import { Module } from "@nestjs/common";

import { Uploader } from "@/domain/forum/application/storage/uploader";

import { EnvModule } from "../modules/env/env.module";
import { R2Storage } from "./r2-storage";

@Module({
  imports: [EnvModule],
  providers: [{ provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
})
export class R2StorageModule {}
