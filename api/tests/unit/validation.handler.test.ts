import { describe, it, expect, jest } from '@jest/globals';
import { handleElysiaValidationError, getFieldNameFromElysiaError } from '../../src/core/errors/validation.handler';
import { languageEnum } from '../../src/core/constants/language.enum';

// Mock the translation functions
jest.mock('../../src/core/locales', () => ({
  translate: jest.fn((lang: languageEnum, key: string) => key),
  translateValidation: jest.fn((lang: languageEnum, key: string) => {
    const messages: Record<string, string> = {
      'string': 'The {field} field must be a string.',
      'minLength': 'The {field} field must be at least {limit} characters.',
      'maxLength': 'The {field} field must be at most {limit} characters.',
      'required': 'The {field} field is required.',
      'type': 'The {field} field has an invalid type.',
    };
    return messages[key] || `Error: ${key}`;
  }),
}));

describe('Validation Handler', () => {
  const lang = languageEnum.EN;

  describe('getFieldNameFromElysiaError', () => {
    it('should extract field name from path with leading slash', () => {
      const error = {
        type: 62,
        schema: {},
        path: '/email',
        value: '',
        message: 'Invalid email',
      };

      const field = getFieldNameFromElysiaError(error);
      expect(field).toBe('email');
    });

    it('should extract field name from nested path', () => {
      const error = {
        type: 62,
        schema: {},
        path: '/user/profile/name',
        value: '',
        message: 'Invalid name',
      };

      const field = getFieldNameFromElysiaError(error);
      expect(field).toBe('user.profile.name');
    });

    it('should return "field" for empty path', () => {
      const error = {
        type: 62,
        schema: {},
        path: '',
        value: '',
        message: 'Invalid value',
      };

      const field = getFieldNameFromElysiaError(error);
      expect(field).toBe('field');
    });
  });

  describe('handleElysiaValidationError', () => {
    it('should process validation errors with string type', async () => {
      const errors = [
        {
          type: 62,
          schema: { type: 'string' },
          path: '/name',
          value: '',
          message: 'Invalid name',
        },
      ];

      const result = await handleElysiaValidationError(errors, lang);

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.status).toBe(400);
      expect(result.validations).toBeDefined();
      expect(result.validations?.length).toBe(1);
      expect(result.validations?.[0].field).toBe('name');
    });

    it('should process validation errors with minLength constraint', async () => {
      const errors = [
        {
          type: 45,
          schema: { minLength: 3 },
          path: '/username',
          value: 'ab',
          message: 'Username too short',
        },
      ];

      const result = await handleElysiaValidationError(errors, lang);

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.status).toBe(400);
      expect(result.validations?.[0].message).toContain('3');
    });

    it('should process validation errors with maxLength constraint', async () => {
      const errors = [
        {
          type: 46,
          schema: { maxLength: 50 },
          path: '/bio',
          value: 'a'.repeat(100),
          message: 'Bio too long',
        },
      ];

      const result = await handleElysiaValidationError(errors, lang);

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.status).toBe(400);
    });

    it('should handle empty errors array', async () => {
      const errors: any[] = [];

      const result = await handleElysiaValidationError(errors, lang);

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.status).toBe(400);
      expect(result.validations).toBeUndefined();
    });

    it('should use "field" for empty path errors', async () => {
      const errors = [
        {
          type: 62,
          schema: { type: 'string' },
          path: '',
          value: '',
          message: 'Invalid value',
        },
      ];

      const result = await handleElysiaValidationError(errors, lang);

      expect(result.validations?.[0].field).toBe('field');
    });
  });
});
