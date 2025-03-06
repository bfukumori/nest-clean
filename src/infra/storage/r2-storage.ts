import { randomUUID } from "node:crypto";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

import {
  Uploader,
  UploadParams,
} from "@/domain/forum/application/storage/uploader";

import { EnvService } from "../modules/env/env.service";

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private readonly envService: EnvService) {
    const accountId = this.envService.get("CLOUDFLARE_ACCOUNT_ID");
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: "auto",
      credentials: {
        accessKeyId: this.envService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.envService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const uniqueFilename = `${uploadId}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.envService.get("AWS_BUCKET_NAME"),
      Key: uniqueFilename,
      ContentType: fileType,
      Body: body,
    });

    await this.client.send(command);

    return {
      url: uniqueFilename,
    };
  }
}
