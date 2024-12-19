import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HttpModule } from "./http/http.module";
import { AuthModule } from "./modules/auth/auth.module";
import { envSchema } from "./modules/env/env";
import { EnvModule } from "./modules/env/env.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
