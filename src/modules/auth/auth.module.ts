import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { Env } from "@/env";
import { PrismaService } from "@/prisma/prisma.service";

import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt-strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Env, true>) => {
        const privateKey = configService.get("JWT_PRIVATE_KEY", {
          infer: true,
        });
        const publicKey = configService.get("JWT_PUBLIC_KEY", { infer: true });

        return {
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
          signOptions: { algorithm: "RS256" },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, JwtStrategy],
})
export class AuthModule {}
