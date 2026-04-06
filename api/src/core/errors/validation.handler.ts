import { ValidationMessageI } from "./error.handler";
import { translate, translateValidation } from "@/core/locales";
import { languageEnum } from "@/core/constants/language.enum";


const TYPE_CODE_MAP: Record<number, string> = {
  0: 'any',
  1: 'array',
  2: 'async_iterator',
  3: 'bigint',
  4: 'boolean',
  5: 'constructor',
  6: 'date',
  7: 'enum',
  8: 'function',
  9: 'integer',
  10: 'interact',
  11: 'iterator',
  12: 'literal',
  13: 'never',
  14: 'null',
  15: 'number',
  16: 'object',
  17: 'promise',
  18: 'record',
  19: 'self',
  20: 'string',
  21: 'symbol',
  22: 'tuple',
  23: 'undefined',
  24: 'union',
  25: 'uint8array',
  26: 'void',
  27: 'any_of',
  28: 'all_of',
  29: 'not',
  30: 'dependent_required',
  31: 'dependent_schemas',
  32: 'exclusive_maximum',
  33: 'exclusive_minimum',
  34: 'inclusive_maximum',
  35: 'inclusive_minimum',
  36: 'min_properties',
  37: 'max_properties',
  38: 'min_items',
  39: 'max_items',
  40: 'min_length',
  41: 'max_length',
  42: 'pattern',
  43: 'multiple_of',
  44: 'unique_items',
  45: 'minLength',
  46: 'maxLength',
  47: 'minItems',
  48: 'maxItems',
  49: 'uniqueItems',
  50: 'minimum',
  51: 'maximum',
  52: 'multipleOf',
  53: 'required',
  54: 'required', // Often triggered on undefined properties
  62: 'type'
};

interface ElysiaValidationError {
  type: number;
  schema: any;
  path: string;
  value: any;
  message: string;
  summary?: string;
}

export function getFieldNameFromElysiaError(error: ElysiaValidationError): string {
  if (error.path === "") return 'field';
  
  const field = error.path.replace(/^\//, '').replace(/\//g, '.');
  return field;
}

export async function handleElysiaValidationError(errors: ElysiaValidationError[], lang: languageEnum) {
  const validations: ValidationMessageI[] = [];

  for (const err of errors) {
    const field = getFieldNameFromElysiaError(err);
    
    const keyword = TYPE_CODE_MAP[err.type] || 'type';

    const msgTemplate = translateValidation(lang, keyword);

    const params = {
      limit: err.schema.minLength ?? err.schema.maxLength ?? err.schema.minimum ?? err.schema.maximum ?? err.schema.minItems ?? err.schema.maxItems,
      expected: err.schema.type,
      ...err.schema
    };

    const formattedMessage = msgTemplate.replace(/\{(\w+)\}/g, (match: string, key: string) => {
      if (key === 'field') return translate(lang, field);

      if (key === 'character' || key === 'caracter') {
        const isEn = lang === 'en';
        const limit = params.limit;
        if (isEn) return limit === 1 ? 'character' : 'characters';
        return limit === 1 ? 'caracter' : 'caracteres';
      }

      if (key === 'item') {
        const limit = params.limit;
        if (lang === 'en') return limit === 1 ? 'item' : 'items';
        return limit === 1 ? 'item' : 'itens';
      }

      const val = params[key];
      if (Array.isArray(val)) return val.join(', ');
      
      return val !== undefined ? val : match;
    });

    validations.push({
      field,
      message: formattedMessage
    });
  }

  return {
    code: "VALIDATION_ERROR",
    status: 400,
    validations: validations.length > 0 ? validations : undefined
  };
}