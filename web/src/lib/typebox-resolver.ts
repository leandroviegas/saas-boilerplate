import { LangsEnum } from '@/enums/LangsEnum';
import { TSchema, Static } from '@sinclair/typebox';
import { FieldErrors, FieldValues, ResolverResult } from 'react-hook-form';
import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

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

  let errorType = error.keyword || 'generic';
  
  let template = messages[errorType] || messages.generic;
  
  const limit = error.params?.limit ?? 
                error.params?.minLength ?? 
                error.params?.maxLength ?? 
                error.params?.minimum ?? 
                error.params?.maximum ?? 
                error.params?.minItems ?? 
                error.params?.maxItems;
  
  const params: Record<string, any> = {
    field,
    type: error.params?.type || error.schema?.type,
    format: error.params?.format || error.schema?.format,
    pattern: error.params?.pattern || error.schema?.pattern,
    limit,
    multiple: error.params?.multipleOf || error.schema?.multipleOf,
    allowedValues: error.params?.allowedValues?.join(', ') || error.schema?.enum?.join(', '),
    allowedValue: error.params?.allowedValue || error.schema?.const,
    character: locale === LangsEnum.PT ? 
      (limit === 1 ? 'caractere' : 'caracteres') : 
      (limit === 1 ? 'character' : 'characters'),
    item: limit === 1 ? 'item' : 'items',
    caracter: limit === 1 ? 'caractere' : 'caracteres',
  };
  
  return formatMessage(template, params);
}

function createAjv(): Ajv {
  const ajv = new Ajv({ 
    allErrors: true, 
    strict: false,
    useDefaults: true,
  });
  
  addFormats(ajv);
  
  return ajv;
}

const validatorCache = new WeakMap<TSchema, ValidateFunction>();

export function typeboxResolver<T extends TSchema>(
  schema: T,
  options: TypeboxResolverOptions = {}
) {
  type FormValues = Static<T> & FieldValues;
  
  return async (values: FormValues): Promise<ResolverResult<FormValues>> => {
    const locale = options.locale || LangsEnum.EN;
    const messages = defaultMessages[locale] || defaultMessages.en;
    
    let validate = validatorCache.get(schema);
    if (!validate) {
      const ajv = createAjv();
      validate = ajv.compile(schema);
      validatorCache.set(schema, validate);
    }
    
    const isValid = validate(values);
    
    if (isValid) {
      return {
        values,
        errors: {},
      } as ResolverResult<FormValues>;
    }
    
    const errors: FieldErrors<FormValues> = {};
    const validationErrors = validate.errors || [];
    
    for (const error of validationErrors) {
      let path = error.instancePath || '';
      path = path.replace(/^\//, '').replace(/\//g, '.');
      
      if (error.keyword === 'required' && error.params?.missingProperty) {
        path = path ? `${path}.${error.params.missingProperty}` : error.params.missingProperty;
      }
      
      const fieldPath = path || 'root';
      
      if (!errors[fieldPath as keyof typeof errors]) {
        const message = translateError(error, path, messages, locale);
        
        (errors as any)[fieldPath] = {
          type: error.keyword || 'validation',
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