import { describe, it, expect, jest } from '@jest/globals';
import { AppError, processError } from '../../src/core/errors/error.handler';
import { languageEnum } from '../../src/core/constants/language.enum';

// Mock the handlers
jest.mock('../../src/core/errors/prisma.handler', () => {
  return {
    handlePrismaError: () => Promise.resolve({
      code: 'RECORD_NOT_FOUND',
      status: 404,
      validations: [{ field: 'test', message: 'Test error' }],
    }),
    handlePrismaValidationError: () => Promise.resolve({
      code: 'VALIDATION_ERROR',
      status: 400,
      validations: [{ field: 'test', message: 'Validation error' }],
    }),
  };
});

jest.mock('../../src/core/errors/validation.handler', () => {
  return {
    handleElysiaValidationError: () => Promise.resolve({
      code: 'VALIDATION_ERROR',
      status: 400,
      validations: [{ field: 'test', message: 'Validation error' }],
    }),
  };
});

describe('Error Handler', () => {
  const lang = languageEnum.EN;

  describe('AppError', () => {
    it('should create an AppError with default values', () => {
      const error = new AppError('NOT_FOUND', 404);

      expect(error.errorCode).toBe('NOT_FOUND');
      expect(error.status).toBe(404);
      expect(error.name).toBe('AppError');
    });

    it('should create an AppError with custom status', () => {
      const error = new AppError('BAD_REQUEST', 400);

      expect(error.errorCode).toBe('BAD_REQUEST');
      expect(error.status).toBe(400);
    });
  });

  describe('processError', () => {
    it('should handle AppError', async () => {
      const error = new AppError('NOT_FOUND', 404);
      const result = await processError(error, lang);

      expect(result.status).toBe(404);
      expect(result.response.code).toBe('NOT_FOUND');
    });

    it('should handle generic Error', async () => {
      const error = new Error('Something went wrong');
      const result = await processError(error, lang);

      expect(result.status).toBe(500);
      expect(result.response.code).toBe('INTERNAL_SERVER_ERROR');
      expect(result.response.message).toBe('Something went wrong');
    });
  });
});
