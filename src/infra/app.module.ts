import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./modules/auth/auth.module";
import { envSchema } from "./modules/env/env";
import { EnvModule } from "./modules/env/env.module";
import { EventsModule } from "./modules/events/events.module";
import { HttpModule } from "./modules/http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EventsModule,
  ],
})
export class AppModule {}
