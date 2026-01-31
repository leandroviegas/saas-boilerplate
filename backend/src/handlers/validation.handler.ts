import { FastifyError } from "fastify";
import { ValidationMessageI } from "./error.handler";
import { translate, translateValidation } from "@/locales";
import { languageEnum } from "@/enums/languageEnum";

interface ValidationErrorItem {
  keyword: string;
  instancePath: string;
  schemaPath: string;
  params: Record<string, any>;
  message?: string;
  propertyName?: string;
}

interface ValidationError extends FastifyError {
  validation?: ValidationErrorItem[];
}

const FIELD_NAME_MAPS: Record<string, string[]> = {
  required: ['missingProperty'],
  additionalProperties: ['additionalProperty'],
  type: ['property'],
  format: ['property'],
  pattern: ['property'],
  minimum: ['property'],
  maximum: ['property'],
  minLength: ['property'],
  maxLength: ['property'],
  minItems: ['property'],
  maxItems: ['property'],
  enum: ['property'],
  const: ['property'],
  multipleOf: ['property'],
  uniqueItems: ['property']
};

export function getFieldNameFromValidationError(error: ValidationErrorItem): string {
  if (error.propertyName) return error.propertyName;
 
  if (error.instancePath) {
    const path = error.instancePath.replace(/\//g, '.').replace(/^\./, '');
    if (path) return path;
  }

  const fieldProperties = FIELD_NAME_MAPS[error.keyword] || [];
  for (const propName of fieldProperties) {
    if (error.params && propName in error.params) {
      return error.params[propName];
    }
  }

  if (error.message) {
    const matches = error.message.match(/'([^']+)'/);
    if (matches && matches[1]) return matches[1];
  }

  return 'field';
};

export async function handleValidationError(error: ValidationError, lang: languageEnum) {
  const validations: ValidationMessageI[] = [];

  if (error.validation) {
    for (const err of error.validation) {
      const field = getFieldNameFromValidationError(err);

      const msgTemplate = translateValidation(lang, err.keyword);

      const formattedMessage = msgTemplate.replace(/\{(\w+)\}/g, (match: string, key: string) => {
        if (key === 'field') return translate(lang, field);

        if (key === 'character' || key === 'caracter') {
          const isEn = lang === 'en';
          const limit = err.params.limit;
          if (isEn) return limit === 1 ? 'character' : 'characters';
          return limit === 1 ? 'caracter' : 'caracteres';
        }

        if (key === 'item') {
          const limit = err.params.limit;
          if (lang === 'en') return limit === 1 ? 'item' : 'items';
          return limit === 1 ? 'item' : 'itens';
        }

        const val = err.params?.[key];
        if (Array.isArray(val)) return val.join(', ');
        return val !== undefined ? val : match;
      });

      validations.push({
        field,
        message: formattedMessage
      });
    }
  }

  return {
    code: "VALIDATION_ERROR",
    status: 400,
    validations: validations.length > 0 ? validations : undefined
  };
};