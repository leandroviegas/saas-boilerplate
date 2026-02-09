import { LangsEnum } from '@/enums/LangsEnum';
import { TSchema, Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { FieldErrors, FieldValues, ResolverResult } from 'react-hook-form';

interface TypeboxResolverOptions {
  locale?: LangsEnum;
}

interface ErrorMessages {
  [key: string]: string;
}

const defaultMessages: Record<string, ErrorMessages> = {
  en: {
    required: "{field} is required.",
    additionalProperties: "{field} has additional properties that are not allowed.",
    type: "{field} must be of type '{type}'.",
    format: "{field} must match the format '{format}'.",
    pattern: "{field} must match the pattern '{pattern}'.",
    minimum: "{field} must be greater than or equal to {limit}.",
    maximum: "{field} must be less than or equal to {limit}.",
    minLength: "{field} must have a minimum length of {limit} {character}.",
    maxLength: "{field} must have a maximum length of {limit} {character}.",
    minItems: "{field} must have at least {limit} {item}.",
    maxItems: "{field} must have at most {limit} {item}.",
    enum: "{field} must be one of {allowedValues}.",
    const: "{field} must be exactly '{allowedValue}'.",
    multipleOf: "{field} must be a multiple of {multiple}.",
    uniqueItems: "{field} must have unique items.",
    generic: "The field {field} is invalid."
  },
  pt: {
    required: "{field} é obrigatório.",
    additionalProperties: "{field} possui propriedades adicionais que não são permitidas.",
    type: "{field} deve ser do tipo '{type}'.",
    format: "{field} deve corresponder ao formato '{format}'.",
    pattern: "{field} deve corresponder ao padrão '{pattern}'.",
    minimum: "{field} deve ser maior ou igual a {limit}.",
    maximum: "{field} deve ser menor ou igual a {limit}.",
    minLength: "{field} deve ter pelo menos {limit} {caracter}.",
    maxLength: "{field} deve ter no máximo {limit} {caracter}.",
    minItems: "{field} deve ter pelo menos {limit} {item}.",
    maxItems: "{field} deve ter no máximo {limit} {item}.",
    enum: "{field} deve ser um de {allowedValues}.",
    const: "{field} deve ser exatamente '{allowedValue}'.",
    multipleOf: "{field} deve ser um múltiplo de {multiple}.",
    uniqueItems: "{field} deve ter itens únicos.",
    generic: "O campo {field} é inválido."
  }
};

function formatMessage(template: string, params: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

function getFieldName(path: string): string {
  // Convert path like "features/0" to "features"
  // or "user.email" to "email"
  const parts = path.split('/').filter(p => !/^\d+$/.test(p));
  return parts[parts.length - 1] || path;
}

function translateError(
  error: any,
  path: string,
  messages: ErrorMessages,
  locale: LangsEnum
): string {
  const field = getFieldName(path);
  
  let errorType = 'generic';
  
  if (error.type === 52 || error.message?.includes('Expected string length greater')) {
    errorType = 'minLength';
  } else if (error.type === 53 || error.message?.includes('Expected string length less')) {
    errorType = 'maxLength';
  } else if (error.type === 54 || error.message?.includes('Expected number greater')) {
    errorType = 'minimum';
  } else if (error.type === 55 || error.message?.includes('Expected number less')) {
    errorType = 'maximum';
  } else if (error.type === 56 || error.message?.includes('Expected array length greater')) {
    errorType = 'minItems';
  } else if (error.type === 57 || error.message?.includes('Expected array length less')) {
    errorType = 'maxItems';
  } else if (error.type === 58 || error.message?.includes('Expected number to be a multiple')) {
    errorType = 'multipleOf';
  } else if (error.type === 59 || error.message?.includes('Expected array to contain unique')) {
    errorType = 'uniqueItems';
  } else if (error.type === 60 || error.message?.includes('Expected value to match')) {
    errorType = 'const';
  } else if (error.type === 61 || (error.message?.includes('Expected') && error.message?.includes('to match'))) {
    errorType = 'enum';
  } else if (error.type === 62 || error.message?.includes('Expected string to match pattern')) {
    errorType = 'pattern';
  } else if (error.type === 63 || error.message?.includes('Expected string to match format')) {
    errorType = 'format';
  } else if (error.type === 50 || error.message?.includes('Expected') && error.message?.includes('type')) {
    errorType = 'type';
  } else if (error.type === 51 || error.message?.includes('Required property')) {
    errorType = 'required';
  } else if (error.type === 64 || error.message?.includes('Unexpected property')) {
    errorType = 'additionalProperties';
  }
  
  let template = messages[errorType] || messages.generic;
  
  let limit: number | undefined;
  if (error.schema) {
    limit = error.schema.minLength ?? 
            error.schema.maxLength ?? 
            error.schema.minimum ?? 
            error.schema.maximum ?? 
            error.schema.minItems ?? 
            error.schema.maxItems;
  }
  
  const params: Record<string, any> = {
    field,
    type: error.schema?.type,
    format: error.schema?.format,
    pattern: error.schema?.pattern,
    limit,
    multiple: error.schema?.multipleOf,
    allowedValues: error.schema?.enum?.join(', '),
    allowedValue: error.schema?.const,
    character: locale === LangsEnum.PT ? 
      (limit === 1 ? 'caractere' : 'caracteres') : 
      (limit === 1 ? 'character' : 'characters'),
    item: limit === 1 ? 'item' : 'items',
    caracter: limit === 1 ? 'caractere' : 'caracteres',
  };
  
  return formatMessage(template, params);
}

export function typeboxResolver<T extends TSchema>(
  schema: T,
  options: TypeboxResolverOptions = {}
) {
  type FormValues = Static<T> & FieldValues;
  
  return async (values: FormValues): Promise<ResolverResult<FormValues>> => {
    const locale = options.locale || LangsEnum.EN;
    const messages = defaultMessages[locale] || defaultMessages.en;
    
    // Validate the values against the schema
    const isValid = Value.Check(schema, values);
    
    if (isValid) {
      return {
        values,
        errors: {},
      } as ResolverResult<FormValues>;
    }
    
    // Get all validation errors
    const errors: FieldErrors<FormValues> = {};
    const validationErrors = [...Value.Errors(schema, values)];
    
    for (const error of validationErrors) {
      const path = error.path.replace(/^\//, '').replace(/\//g, '.');
      const fieldPath = path || 'root';
      
      // Set the error message for this field
      if (!errors[fieldPath as keyof typeof errors]) {
        const message = translateError(error, error.path, messages, locale);
        
        (errors as any)[fieldPath] = {
          type: error.type?.toString() || 'validation',
          message,
        };
      }
    }
    
    return {
      values: {} as FormValues,
      errors,
    } as ResolverResult<FormValues>;
  };
}