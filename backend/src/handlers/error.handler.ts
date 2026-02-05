import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import { handlePrismaError, handlePrismaValidationError } from "./prisma.handler";
import { handleValidationError } from "./validation.handler";

interface ErrorResponse {
  validations?: ValidationMessageI[];
  code: string;
  message?: string;
}

export interface ValidationMessageI {
  field?: string;
  message: string;
}

interface ValidationError extends FastifyError {
  validation?: any[];
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

export async function errorHandler(
  error: ValidationError | PrismaClientKnownRequestError | PrismaClientValidationError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  let response: ErrorResponse = {
    code: "INTERNAL_SERVER_ERROR"
  };

  if (error instanceof AppError) {
    response.code = error.errorCode;
    reply.status(error.status).send(response);
    return;
  }

  if ('validation' in error && Array.isArray(error.validation)) {
    const { code, status, validations } = await handleValidationError(error, request.lang);
    response.code = code;
    response.validations = validations;
    reply.status(status).send(response);
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    const { code, status, validations } = await handlePrismaError(error, request.lang);
    response.code = code;
    response.validations = validations;
    reply.status(status).send(response);
    return;
  }

  if (error instanceof PrismaClientValidationError) {
    const { code, status } = await handlePrismaValidationError(error, request.lang);
    response.code = code;
    reply.status(status).send(response);
    return;
  }

  response = {
    ...response,
    message: error.message
  }

  request.log.error({
    err: error,
    stack: error instanceof Error ? error.stack : undefined,
    method: request.method,
  });

  reply.status(500).send(response);
}