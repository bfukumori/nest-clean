import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/modules/database/database.module";

describe("Authenticate account (e2e)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test("[POST] /sessions", async () => {
    await studentFactory.makePrismaStudent({
      email: "johndoe@example.com",
      password: await hash("123456", 8),
    });

    const response = await request(app.getHttpServer()).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
