import { describe, it, expect, jest } from '@jest/globals';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/client';
import { handlePrismaError, handlePrismaValidationError } from '../../src/core/errors/prisma.handler';
import { languageEnum } from '../../src/core/constants/language.enum';

// Mock the translation function
jest.mock('../../src/core/locales', () => ({
  translateValidation: jest.fn((lang: languageEnum, key: string) => {
    const messages: Record<string, string> = {
      'P2002': 'The {field} field must be unique.',
      'P2003': 'The {field} field does not exist.',
      'P2011': 'The {field} field cannot be null.',
      'validation': 'Invalid input.',
    };
    return messages[key] || key;
  }),
}));

describe('Prisma Error Handler', () => {
  const lang = languageEnum.EN;

  describe('handlePrismaError', () => {
    it('should handle P2002 unique constraint violation', async () => {
      const error = {
        code: 'P2002',
        meta: { target: ['email'] },
      } as unknown as PrismaClientKnownRequestError;

      const result = await handlePrismaError(error, lang);

      expect(result.code).toBe('UNIQUE_CONSTRAINT_VIOLATION');
      expect(result.status).toBe(409);
      expect(result.validations).toHaveLength(1);
      expect(result.validations?.[0]).toEqual({
        field: 'email',
        message: 'The email field must be unique.',
      });
    });

    it('should handle P2003 foreign key constraint violation', async () => {
      const error = {
        code: 'P2003',
        meta: { field_name: 'role_id' },
      } as unknown as PrismaClientKnownRequestError;

      const result = await handlePrismaError(error, lang);

      expect(result.code).toBe('FOREIGN_KEY_CONSTRAINT_VIOLATION');
      expect(result.status).toBe(400);
      expect(result.validations?.[0]).toEqual({
        field: 'role_id',
        message: 'The {field} field does not exist.',
      });
    });

    it('should handle P2011 null constraint violation', async () => {
      const error = {
        code: 'P2011',
        meta: { constraint: ['name', 'email'] },
      } as unknown as PrismaClientKnownRequestError;

      const result = await handlePrismaError(error, lang);

      expect(result.code).toBe('NULL_CONSTRAINT_VIOLATION');
      expect(result.status).toBe(400);
      expect(result.validations).toHaveLength(2);
    });

    it('should handle P2001 record not found', async () => {
      const error = {
        code: 'P2001',
      } as unknown as PrismaClientKnownRequestError;

      const result = await handlePrismaError(error, lang);

      expect(result.code).toBe('RECORD_NOT_FOUND');
      expect(result.status).toBe(404);
    });

    it('should handle unknown Prisma errors with default mapping', async () => {
      const error = {
        code: 'P9999',
      } as unknown as PrismaClientKnownRequestError;

      const result = await handlePrismaError(error, lang);

      expect(result.code).toBe('DATABASE_ERROR');
      expect(result.status).toBe(500);
    });
  });

  describe('handlePrismaValidationError', () => {
    it('should handle Prisma validation error', async () => {
      const error = new PrismaClientValidationError(
        'Invalid argument provided',
        { clientVersion: '1.0.0' }
      );

      const result = await handlePrismaValidationError(error, lang);

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.status).toBe(400);
      expect(result.validations).toBeDefined();
      expect(result.validations?.length).toBeGreaterThan(0);
    });
  });
});
