import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === "custom") {
      return value;
    }

    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          error: "Validation failed",
          statusCode: 400,
          message: !error.errors.every((err) => err.path)
            ? error.flatten().fieldErrors
            : error.flatten().formErrors,
        });
      }
      throw new BadRequestException("Validation failed");
    }
  }
}
