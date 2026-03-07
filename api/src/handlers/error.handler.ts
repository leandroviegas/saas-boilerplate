import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import { handlePrismaError, handlePrismaValidationError } from "./prisma.handler";
import { languageEnum } from '@/enums/language-enum';
import { handleElysiaValidationError } from "./validation.handler";
import { ValidationError } from "elysia";

interface ErrorResponse {
  validations?: ValidationMessageI[];
  code: string;
  message?: string;
}

export interface ValidationMessageI {
  field?: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    public readonly errorCode: string,
    public readonly status: number = 500
  ) {
    super();
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export async function processError(
  error: unknown, // Some error
  lang: languageEnum
): Promise<{ status: number; response: ErrorResponse }> {
  const baseResponse: ErrorResponse = {
    code: "INTERNAL_SERVER_ERROR"
  };

  // Handle AppError
  if (error instanceof AppError) {
    return {
      status: error.status,
      response: {
        code: error.errorCode
      }
    };
  }

  if (error instanceof ValidationError) {
    const { code, status, validations } = await handleElysiaValidationError(
      error.all,
      lang
    );

    return {
      status,
      response: {
        code,
        validations
      }
    };
  }


  // Handle Prisma known request errors
  if (error instanceof PrismaClientKnownRequestError) {
    const { code, status, validations } = await handlePrismaError(error, lang);
    return {
      status,
      response: {
        code,
        validations
      }
    };
  }

  // Handle Prisma validation errors
  if (error instanceof PrismaClientValidationError) {
    const { code, status } = await handlePrismaValidationError(error, lang);
    return {
      status,
      response: {
        code
      }
    };
  }

  // Handle generic errors
  const err = error as Error;
  return {
    status: 500,
    response: {
      ...baseResponse,
      message: err.message
    }
  };
}