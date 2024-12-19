import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { CryptographyModule } from "@/infra/crytography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { EnvService } from "@/infra/modules/env/env.service";

import { EnvModule } from "../env/env.module";
import { AuthController } from "./auth.controller";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtStrategy } from "./jwt-strategy";
import { AuthenticateStudentService } from "./services/authenticate-student.service";

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory: async (env: EnvService) => {
        const privateKey = env.get("JWT_PRIVATE_KEY");
        const publicKey = env.get("JWT_PUBLIC_KEY");

        return {
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
          signOptions: { algorithm: "RS256" },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthenticateStudentService,
    EnvService,
    { provide: "APP_GUARD", useClass: JwtAuthGuard },
  ],
})
export class AuthModule {}
