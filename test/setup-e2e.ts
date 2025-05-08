import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { afterAll, beforeAll } from "vitest";

import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/modules/env/env";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const prisma = new PrismaClient();

const env = envSchema.parse(process.env);

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const url = new URL(env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false;

  execSync("pnpx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect();
});
