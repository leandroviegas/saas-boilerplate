---
name: ddd-pattern-standard
description: Apply Domain-Driven Design (DDD) patterns to ElysiaJS projects. Standardizes directory structure (core, domain, application, infrastructure, interfaces), service orchestration with Prisma (no repositories), error handling, and Elysia type schemas. Use when restructuring, creating new domains, or implementing services and controllers.
---

# DDD Pattern Standard for SaaS Boilerplate

Standardized Domain-Driven Design (DDD) architecture for ElysiaJS-based TypeScript API.

## Directory Structure

```text
src/
  ├── core/                   # Shared, cross-cutting concerns (Global)
  │   ├── errors/             # Error handlers and custom error classes
  │   │   ├── error.handler.ts      # Main error processing
  │   │   ├── prisma.handler.ts     # Prisma-specific error mapping
  │   │   └── validation.handler.ts # Elysia validation error handling
  │   ├── types/              # Project-wide TypeScript types
  │   ├── constants/          # Enums and global constants
  │   ├── utils/              # Pure utility functions
  │   └── locales/            # i18n/L10n translation files
  │       ├── index.ts        # Translation functions and caching
  │       ├── en/             # English translations
  │       └── pt/             # Portuguese translations
  │
  ├── domain/                 # Business logic abstractions and rules
  │   ├── shared/             # Base classes and shared domain logic
  │   │   └── abstract.service.ts
  │   └── {domain}/           # Domain interfaces and types
  │       └── {domain}-provider.interface.ts
  │
  ├── application/            # Use cases and orchestration (Services)
  │   ├── index.ts            # Service instantiation and export registry
  │   └── {domain}/           # Orchestration services for a specific domain
  │       └── {domain}.service.ts
  │
  ├── infrastructure/         # External tool implementations
  │   ├── config/             # Environment and application configuration
  │   ├── auth/               # Auth implementation (e.g., Better-Auth)
  │   ├── database/           # Prisma client, transactions, and seeds
  │   │   ├── prisma/
  │   │   │   ├── client.ts            # Extended Prisma client
  │   │   │   └── transaction-context.ts # Transaction management
  │   ├── cache/              # Redis/Cache implementation
  │   ├── logger/             # Logging service implementation
  │   │   └── logger.ts       # Winston logger configuration
  │   ├── websocket/          # Socket.io/WS server setup
  │   └── payment/            # Third-party providers (Stripe, etc.)
  │
  └── interfaces/             # Entry points for external communication
      └── http/               # REST API Layer
          ├── server.ts       # Application entry point
          ├── routes.ts       # Main router registry
          ├── controllers/    # Request handlers (admin, member, public)
          ├── middleware/     # Auth, logs, and validation middleware
          ├── schemas/        # Elysia type validation schemas
          └── decorators/     # Custom Elysia decorators
              └── transactional.ts
```

## Core Components Implementation

### Transaction Management

#### Prisma Transaction Context (`src/infrastructure/database/prisma/transaction-context.ts`)
```typescript
import { AsyncLocalStorage } from "node:async_hooks";
import { ExtendedPrismaClient } from "@/infrastructure/database/prisma/client";
import type { TransactionClient } from "@/core/types/prisma";

export type TransactionOptions = {
  timeout?: number;
  maxWait?: number;
  isolationLevel?: "ReadCommitted" | "RepeatableRead" | "Serializable";
};

const MAX_TIMEOUT_MS = 30_000;
const DEFAULT_TIMEOUT_MS = 5_000;

type TransactionStore = {
  client: TransactionClient;
  id: string;
};

export class PrismaTransactionContext {
  private storage = new AsyncLocalStorage<TransactionStore>();

  constructor(private readonly prisma: ExtendedPrismaClient) {
    if (!prisma) {
      throw new Error(
        "PrismaTransactionContext: prisma client is required but received undefined/null."
      );
    }
  }

  _getClient(): TransactionClient {
    return this.storage.getStore()?.client ?? (this.prisma as unknown as TransactionClient);
  }

  isInTransaction(): boolean {
    return this.storage.getStore() !== undefined;
  }

  currentTransactionId(): string | undefined {
    return this.storage.getStore()?.id;
  }

  async run<T>(
    callback: () => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    if (this.isInTransaction()) {
      if (process.env.NODE_ENV !== "production") {
        console.debug(
          `[PrismaTransactionContext] Reusing transaction ${this.currentTransactionId()} — nested run() call detected.`
        );
      }
      return callback();
    }

    const resolvedTimeout = Math.min(
      options?.timeout ?? DEFAULT_TIMEOUT_MS,
      MAX_TIMEOUT_MS
    );

    if (options?.timeout !== undefined && options.timeout > MAX_TIMEOUT_MS) {
      console.warn(
        `[PrismaTransactionContext] Requested timeout ${options.timeout}ms exceeds the maximum of ${MAX_TIMEOUT_MS}ms. Clamping to ${MAX_TIMEOUT_MS}ms.`
      );
    }

    const txId = crypto.randomUUID();

    return this.prisma.$transaction(
      (tx: TransactionClient) => {
        const store: TransactionStore = { client: tx, id: txId };
        return this.storage.run(store, () => callback());
      },
      {
        ...options,
        timeout: resolvedTimeout,
      }
    );
  }
}
```

#### Transactional Decorator (`src/interfaces/http/decorators/transactional.ts`)
```typescript
import type { PrismaTransactionContext, TransactionOptions } from "@/infrastructure/database/prisma/transaction-context";

export function Transactional(options?: TransactionOptions) {
  return function (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod: (...args: unknown[]) => Promise<unknown> = descriptor.value;

    if (typeof originalMethod !== "function") {
      throw new Error(
        `@Transactional() can only decorate methods. ` +
        `"${String(propertyKey)}" is not a function.`
      );
    }

    if (originalMethod.constructor.name !== "AsyncFunction") {
      throw new Error(
        `@Transactional() requires an async method. ` +
        `"${String(propertyKey)}" is synchronous. ` +
        "Wrap the method body in async or return a Promise."
      );
    }

    descriptor.value = async function (
      this: Record<string, unknown>,
      ...args: unknown[]
    ): Promise<unknown> {
      const txContext = this["transaction"];

      if (
        txContext === undefined ||
        txContext === null ||
        typeof (txContext as PrismaTransactionContext).run !== "function"
      ) {
        throw new Error(
          `@Transactional() on "${String(propertyKey)}": the host class must have a ` +
          "'transaction' property of type PrismaTransactionContext " +
          "(i.e. it must extend AbstractService). " +
          "Check your class definition and dependency injection setup."
        );
      }

      return (txContext as PrismaTransactionContext).run(
        () => originalMethod.apply(this, args),
        options
      );
    };

    return descriptor;
  };
}
```

#### Abstract Service (`src/domain/shared/abstract.service.ts`)
```typescript
import type { TransactionClient } from "@/core/types/prisma";
import { PrismaTransactionContext } from "@/infrastructure/database/prisma/transaction-context";

export abstract class AbstractService {
  constructor(
    protected readonly transaction: PrismaTransactionContext
  ) {
    if (!transaction) {
      throw new Error(
        `${new.target.name}: PrismaTransactionContext is required but received undefined/null. ` +
        "Check your dependency injection configuration."
      );
    }
  }

  protected get prisma(): TransactionClient {
    return this.transaction._getClient();
  }
}
```

#### Transactional Decorator Usage

The `@Transactional()` decorator provides automatic transaction management for service methods:

**Requirements:**
- Methods must be `async`
- Host class must extend `AbstractService` (or have a `transaction` property of type `PrismaTransactionContext`)

**Features:**
- **Nested Safety**: Multiple `@Transactional` calls reuse the same transaction
- **Automatic Rollback**: Exceptions automatically rollback the transaction
- **Timeout Control**: Configurable timeouts with sensible defaults (5s default, 30s max)
- **Debug Logging**: Transaction IDs logged in development mode

**Example:**
```typescript
export class UserService extends AbstractService {
  // Single operation transaction
  @Transactional()
  async updateProfile(id: string, data: UpdateProfileData) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return this.prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }

  // Multiple operations in one transaction
  @Transactional({ isolationLevel: "Serializable" })
  async transferCredits(fromUserId: string, toUserId: string, amount: number) {
    await this.prisma.user.update({
      where: { id: fromUserId },
      data: { credits: { decrement: amount } }
    });

    await this.prisma.user.update({
      where: { id: toUserId },
      data: { credits: { increment: amount } }
    });

    await this.prisma.transactionLog.create({
      data: { fromUserId, toUserId, amount, type: "TRANSFER" }
    });
  }
}
```

**Transaction Options:**
- `timeout`: Transaction timeout in milliseconds (max 30,000ms)
- `maxWait`: Maximum wait time for acquiring connection
- `isolationLevel`: Transaction isolation level

### Error Handling

#### AppError Class (`src/core/errors/error.handler.ts`)
```typescript
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

export interface ValidationMessageI {
  field?: string;
  message: string;
}
```

#### Error Processing (`src/core/errors/error.handler.ts`)
```typescript
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import { handlePrismaError, handlePrismaValidationError } from "./prisma.handler";
import { languageEnum } from '@/core/constants/language.enum';
import { handleElysiaValidationError } from "./validation.handler";
import { ValidationError } from "elysia";

interface ErrorResponse {
  validations?: ValidationMessageI[];
  code: string;
  message?: string;
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
```

#### Prisma Error Handler (`src/core/errors/prisma.handler.ts`)
```typescript
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";
import { ValidationMessageI } from "./error.handler";
import { languageEnum } from "@/core/constants/language.enum";
import { translateValidation } from "@/core/locales";

const PRISMA_ERROR_MAP: Record<string, { code: string; status: number }> = {
  P2001: { code: "RECORD_NOT_FOUND", status: 404 },
  P2003: { code: "FOREIGN_KEY_CONSTRAINT_VIOLATION", status: 400 },
  P2007: { code: "INVALID_DATA", status: 400 },
  P2008: { code: "TIMEOUT_ERROR", status: 504 },
  P2009: { code: "QUERY_ERROR", status: 400 },
  P2010: { code: "RAW_QUERY_ERROR", status: 400 },
  P2011: { code: "NULL_CONSTRAINT_VIOLATION", status: 400 },
  P2012: { code: "MISSING_REQUIRED_VALUE", status: 400 },
  P2013: { code: "MISSING_REQUIRED_ARGUMENT", status: 400 },
  P2014: { code: "RELATION_VIOLATION", status: 400 },
  P2015: { code: "RECORD_NOT_FOUND", status: 404 },
  P2016: { code: "QUERY_INTERPRETATION_ERROR", status: 400 },
  P2017: { code: "RECORD_NOT_FOUND", status: 404 },
  P2018: { code: "CONNECTION_FAILED", status: 500 },
  P2019: { code: "INPUT_ERROR", status: 400 },
  P2020: { code: "VALUE_ERROR", status: 400 },
  P2021: { code: "TABLE_ERROR", status: 500 },
  P2022: { code: "COLUMN_ERROR", status: 500 },
  P2023: { code: "INCONSISTENT_COLUMN_ERROR", status: 500 },
  P2024: { code: "TIMEOUT_ERROR", status: 504 },
  P2025: { code: "RECORD_NOT_FOUND", status: 404 },
};

const extractFields = (meta: any): string[] => {
  const adapterFields = meta?.driverAdapterError?.cause?.constraint?.fields;
  if (Array.isArray(adapterFields)) {
    return adapterFields.map((f: string) => f.replace(/['"]+/g, ''));
  }

  if (Array.isArray(meta?.target)) {
    return meta.target;
  }

  return [];
};

export async function handlePrismaError(error: PrismaClientKnownRequestError, lang: languageEnum) {
  if (error.code === "P2002") {
    const fields = extractFields(error.meta);
    const validations = fields.map(field => ({
      field,
      message: translateValidation(lang, "P2002").replace('{field}', field)
    }));

    return {
      code: `UNIQUE_CONSTRAINT_VIOLATION`,
      status: 409,
      validations
    };
  }

  if (error.code === "P2003") {
    const field = (error.meta?.field_name as string) || "unknown_field";
    return {
      code: "FOREIGN_KEY_CONSTRAINT_VIOLATION",
      status: 400,
      validations: [{
        field: field.replace(/[()]/g, ""),
        message: translateValidation(lang, "P2003")
      }]
    };
  }

  if (error.code === "P2011") {
    const constraint = (error.meta?.constraint as string[]) || [];
    return {
      code: "NULL_CONSTRAINT_VIOLATION",
      status: 400,
      validations: constraint.map(field => ({
        field,
        message: translateValidation(lang, "P2011")
      }))
    };
  }

  const mappedError = PRISMA_ERROR_MAP[error.code];
  if (mappedError) {
    return { ...mappedError };
  }

  return { code: "DATABASE_ERROR", status: 500 };
}

export async function handlePrismaValidationError(error: PrismaClientValidationError, lang: languageEnum) {
  return {
    code: "VALIDATION_ERROR",
    status: 400,
    validations: [
      {
        message: error.message.split('\n').pop()?.trim() || translateValidation(lang, "validation")
      }
    ]
  };
}
```

### Internationalization/Locales

#### Translation System (`src/core/locales/index.ts`)
```typescript
import { languageEnum } from '@/core/constants/language.enum';
import logger from '@/infrastructure/logger/logger';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface LocaleMessages {
  [key: string]: string;
}

const LOCALES_BASE_PATH = path.resolve(__dirname);
const cache = new Map<string, LocaleMessages>();

function processTranslation(
  lang: languageEnum,
  fileName: string,
  key: string
): string {
  const directoryPath = path.join(LOCALES_BASE_PATH, lang);
  const filePath = path.join(directoryPath, fileName);
  const cacheKey = `${lang}:${fileName}`;

  try {
    let messages: LocaleMessages = {};

    if (cache.has(cacheKey)) {
      messages = cache.get(cacheKey)!;
    } else {
      try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        messages = JSON.parse(rawData);
        cache.set(cacheKey, messages);
      } catch (readError: any) {
        if (readError.code !== 'ENOENT') throw readError;
      }
    }

    if (messages[key]) {
      return messages[key];
    }

    messages[key] = key;
    
    if (!existsSync(directoryPath)) {
      mkdirSync(directoryPath, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf-8');
    
    cache.set(cacheKey, messages);
    
    return key;
  } catch (error) {
    logger.error(`Translation Error [File: ${fileName}, Lang: ${lang}]:`, error);
    return key;
  }
}

export function translate(lang: languageEnum, errorCode: string): string {
  return processTranslation(lang, 'common.json', errorCode);
}

export function translateValidation(lang: languageEnum, msg: string): string {
  return processTranslation(lang, 'validation.json', msg);
}

export function clearTranslationCache(): void {
  cache.clear();
}
```

#### Translation Files Structure
```
src/core/locales/
├── en/
│   ├── common.json     # General error messages
│   └── validation.json # Validation error messages
└── pt/
    ├── common.json
    └── validation.json
```

### Logging Infrastructure

#### Winston Logger (`src/infrastructure/logger/logger.ts`)
```typescript
import winston from 'winston';
import 'winston-daily-rotate-file';

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'grey'
};

const levelMap: Record<number, string> = {
  10: 'debug',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'error'
};

winston.addColors(levelColors);

const normalizeLevelFormat = winston.format((info) => {
  if (typeof info.level === 'number') {
    info.level = levelMap[info.level] || 'info';
  }
  return info;
});

const flattenMessageFormat = winston.format((info) => {
  try {
    const parsed = JSON.parse(info.message as string);
    const msg = parsed.msg || info.message;
    delete parsed.msg;

    return {
      ...info,
      ...parsed,
      message: msg,
    };
  } catch {
    return info;
  }
});

const colorizer = winston.format.colorize();

const consoleFormat = winston.format.combine(
  normalizeLevelFormat(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  flattenMessageFormat(),
  winston.format.printf(({ timestamp, level, message }) => {
    let coloredLevel = level;
    try {
      coloredLevel = colorizer.colorize(level, String(level).toUpperCase());
    } catch (e) {
    }
    return `${timestamp} [${coloredLevel}]: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  normalizeLevelFormat(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  flattenMessageFormat(),
  winston.format.json()
);

const createRotatingTransport = (
  filename: string,
  level: string,
  maxFiles: string = '14d',
  maxSize: string = '20m'
) => {
  const transport = new winston.transports.DailyRotateFile({
    filename: `logs/%DATE%/${filename}.log`,
    datePattern: 'YYYY-MM-DD',
    level,
    maxFiles,
    maxSize,
    format: fileFormat,
    zippedArchive: true,
    auditFile: `logs/.${filename}-audit.json`
  });

  transport.on('rotate', (oldFilename, newFilename) => {
    console.log(`Log rotated from ${oldFilename} to ${newFilename}`);
  });

  return transport;
};

const consoleTransport = new winston.transports.Console({ 
  format: consoleFormat 
});

const errorLogTransport = createRotatingTransport('error', 'error');
const warnLogTransport = createRotatingTransport('warn', 'warn');
const infoLogTransport = createRotatingTransport('info', 'info');
const debugLogTransport = createRotatingTransport('debug', 'debug', '7d');
const combinedLogTransport = createRotatingTransport('combined', 'silly', '30d', '50m');

const logger = winston.createLogger({
  format: fileFormat,
  defaultMeta: { service: 'elysia-api' },
  transports: [
    errorLogTransport,
    warnLogTransport,
    infoLogTransport,
    debugLogTransport,
    combinedLogTransport,
    consoleTransport
  ]
});

export default logger;
```

## Domain Layer Examples

### Domain Interface (`src/domain/payment/payment-provider.interface.ts`)
```typescript
export interface CreateCheckoutSessionOptions {
  userId: string;
  organizationId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  promotionCode?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSession {
  id: string;
  url: string | null;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  features: string[];
  active: boolean;
}

export interface ProductPriceType {
  id: string;
  productId?: string;
  amount: number;
  currency: string;
  stripePriceId?: string;
  active: boolean;
  intervalType: string;
  intervalValue: number;
}

export interface CouponType {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  expiresAt?: string;
  usageLimit?: number;
  active: boolean;
}

export interface PaymentProvider {
  createCheckoutSession(options: CreateCheckoutSessionOptions): Promise<CheckoutSession>;
  handleWebhook(payload: any, signature: string): Promise<void>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  createProduct(product: ProductType): Promise<string>;
  updateProduct(productId: string, product: ProductType): Promise<string>;
  deleteProduct(productId: string): Promise<void>;
  createProductPrice(productId: string, price: ProductPriceType): Promise<string>;
  updateProductPrice(priceId: string, price: ProductPriceType): Promise<string>;
  deleteProductPrice(priceId: string): Promise<void>;
  createCoupon(coupon: CouponType): Promise<string>;
  updateCoupon(couponId: string, coupon: CouponType): Promise<string>;
  deleteCoupon(couponId: string): Promise<void>;
}
```

## Testing Patterns

### Unit Test for Error Handler (`tests/unit/error.handler.test.ts`)
```typescript
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
```

### Unit Test for Prisma Handler (`tests/unit/prisma.handler.test.ts`)
```typescript
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
```

## Pattern Guidelines

### 1. No Repositories
Direct use of the Prisma client (or its transaction context) is preferred within the **Application Layer** services to reduce boilerplate. Business rules must be moved to the **Domain Layer**.

### 2. Service Orchestration
- **Application Services**: Inherit from `AbstractService` in `@/domain/shared/abstract.service`.
- **Dependency Injection**: Services receive `PrismaTransactionContext` in their constructor.
- **Registry**: All services must be instantiated and exported in `src/application/index.ts`.

### 3. Error Handling
- **Registry**: Map internal exceptions to HTTP responses in `@/core/errors/error.handler.ts`.
- **Flow**: Domain rules throw specific errors -> Application Service propagates -> Global Error Handler catches and translates.

### 4. Schema Validation
- **Location**: `interfaces/http/schemas/models/{domain}.schema.ts`.
- **Standard**: Use **Elysia types** (`t.Object`, `t.Optional`, etc.) for all request/response validation.
- **DTOs**: Controllers must use these schemas for `.body`, `.query`, and `.params` validation.

### 5. Infrastructure Isolation
- Implementation details (Redis client, S3 client, Stripe SDK) live in `infrastructure`.
- Domain-specific interfaces for these tools live in `domain/{domain}/`.

### 6. Import Aliases (tsconfig.json)
Always use these aliases to maintain layer isolation:
- `@/core/*` -> `src/core/*`
- `@/domain/*` -> `src/domain/*`
- `@/application/*` -> `src/application/*`
- `@/infrastructure/*` -> `src/infrastructure/*`
- `@/interfaces/*` -> `src/interfaces/*`

## Implementation Example

### Application Service (`src/application/user/user.service.ts`)
```typescript
import { s3Service } from "@/application";
import { AbstractService } from "@/domain/shared/abstract.service";
import { PaginationType } from "@/interfaces/http/schemas/pagination";
import { Prisma } from "@prisma/client";
import { UpdateUserBodyType } from "@/interfaces/http/controllers/admin/user.controller";
import { Transactional } from "@/interfaces/http/decorators/transactional";
import logger from "@/infrastructure/logger/logger";

export class UserService extends AbstractService {
  findAll(pagination: PaginationType) {
    const { search, page, perPage } = pagination;

    let where: Prisma.UserWhereInput = {};

    if (search) {
      where = {
        ...where,
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { username: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ]
      }
    }

    return this.prisma.user.paginate({ where, orderBy: { createdAt: 'desc' } }, { page, perPage });
  }

  findById(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { email },
    });
  }

  @Transactional()
  async update(id: string, data: UpdateUserBodyType) {
    const existingUser = await this.findById(id);
    const oldImageUrl = existingUser.image;
    let newImageUrl = existingUser.image;
    let wasNewImageUploaded = false;

    if (data.image && data.image.startsWith('data:image/')) {
      const [mime, base64] = data.image.split(',');
      const contentType = mime.split(':')[1].split(';')[0];
      const buffer = Buffer.from(base64, 'base64');
      const extension = contentType.split('/')[1];

      newImageUrl = `users/${id}/profile-${Date.now()}.${extension}`;
      await s3Service.uploadFile(buffer, newImageUrl, contentType);
      wasNewImageUploaded = true;
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          name: data.name,
          image: newImageUrl,
          username: data.username,
          preferences: data.preferences,
        },
      });

      // 3. Success: Delete the OLD image from S3 (if it changed)
      if (wasNewImageUploaded && oldImageUrl) {
        await s3Service.deleteFile(oldImageUrl);
      }

      return updatedUser;
    } catch (error) {
      // 4. Failure: Cleanup the NEWLY uploaded image so S3 stays clean
      if (wasNewImageUploaded) {
        await s3Service.deleteFile(newImageUrl);
      }

      throw error;
    }
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
```

### Service Registry (`src/application/index.ts`)
```typescript
import { transactionContext } from "@/infrastructure/database/prisma/client";

import { AuthService } from "./auth/auth.service";
import { CouponService } from "./coupon/coupon.service";
import { EmailService } from "./shared/email.service";
import { NotificationService } from "./notification/notification.service";
import { OrganizationRolePermissionService } from "./organization/organization-role-permission.service";
import { OrganizationService } from "./organization/organization.service";
import { PaymentService } from "./payment/payment.service";
import { ProductPriceService } from "./product/product-prices.service";
import { ProductService } from "./product/product.service";
import { RoleService } from "./shared/role.service";
import { S3Service } from "./shared/s3.service";
import { SessionService } from "./auth/session.service";
import { UserService } from "./user/user.service";
import { WebsocketsService } from "./shared/websockets.service";
import { SystemVariableService } from "@/application/shared/system-variable.service";

export { transactionContext };

export const authService = new AuthService(transactionContext);
export const systemVariableService = new SystemVariableService(transactionContext);
export const couponService = new CouponService(transactionContext);
export const emailService = new EmailService(transactionContext);
export const notificationService = new NotificationService(transactionContext);
export const organizationRolePermissionService = new OrganizationRolePermissionService(transactionContext);
export const organizationService = new OrganizationService(transactionContext);
export const paymentService = new PaymentService(transactionContext);
export const productPriceService = new ProductPriceService(transactionContext);
export const productService = new ProductService(transactionContext);
export const roleService = new RoleService(transactionContext);
export const s3Service = new S3Service(transactionContext);
export const sessionService = new SessionService(transactionContext);
export const userService = new UserService(transactionContext);
export const websocketsService = new WebsocketsService();
```

### Controller (`src/interfaces/http/controllers/user.controller.ts`)
```typescript
import { Elysia } from "elysia";
import { userService } from "@/application";
import { UserSchema } from "@/interfaces/http/schemas/models/user.schema";

export const userController = new Elysia({ prefix: "/user" })
  .post("/", ({ body }) => userService.createUser(body), {
    body: UserSchema
  });
```

## Best Practices and Common Patterns

### 1. Service Method Naming Conventions
- Use descriptive names: `createUser`, `updateUserProfile`, `findUsersByRole`
- Prefix with action: `create`, `find`, `update`, `delete`, `send`, `process`
- Use domain terms consistently

### 2. Error Handling Patterns
```typescript
// Domain-specific errors
export class BusinessRuleViolationError extends AppError {
  constructor(message: string) {
    super("BUSINESS_RULE_VIOLATION", 400);
  }
}

// Service error handling with transaction rollback
@Transactional()
async complexBusinessOperation(data: InputType): Promise<ResultType> {
  // Business logic here - transaction will rollback on error
  const result = await this.doSomething(data);
  return result;
}
```

### 4. Transaction Management
```typescript
// Nested transactions are safe
@Transactional()
async parentOperation() {
  await this.childOperation(); // Also @Transactional - reuses parent transaction
}

// Multiple operations in one transaction
@Transactional()
async batchUpdate(users: UserUpdate[]) {
  for (const update of users) {
    await this.updateUser(update.id, update.data);
  }
}
```

### 5. Dependency Injection in Services
```typescript
// Services can depend on other services
export class OrderService extends AbstractService {
  constructor(
    transaction: PrismaTransactionContext,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly emailService: EmailService
  ) {
    super(transaction);
  }
}
```

### 6. Schema Validation Patterns
```typescript
// Use Elysia types for runtime validation
import { t } from "elysia";

export const CreateUserSchema = t.Object({
  email: t.String({ format: 'email' }),
  name: t.String({ minLength: 2, maxLength: 100 }),
  username: t.Optional(t.String({ minLength: 3, maxLength: 50 })),
  preferences: t.Optional(t.Record(t.String(), t.Any()))
});

// Controller usage
.post('/users', ({ body }) => userService.createUser(body), {
  body: CreateUserSchema
})
```

### 7. Pagination and Filtering

#### Custom Pagination Schema (`src/interfaces/http/schemas/pagination.ts`)
```typescript
import { t, Static } from "elysia";

export const paginationSchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  perPage: t.Optional(t.Numeric({ default: 20, minimum: 1 })),
  search: t.Optional(t.String({ default: "" })),
});

export type PaginationType = Static<typeof paginationSchema>;

export const metaSchema = t.Object({
  total: t.Integer(),
  page: t.Integer(),
  perPage: t.Integer(),
});
```

#### Custom Pagination Extension (`src/infrastructure/database/prisma/client.ts`)
```typescript
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

export type PaginationOptions = {
    page?: number | string;
    perPage?: number | string;
};

export const paginationExtension = Prisma.defineExtension(client => {
    return client.$extends({
        name: 'pagination',
        model: {
            $allModels: {
                async paginate<T, A>(
                    this: T,
                    arg: Prisma.Exact<A, Prisma.Args<T, 'findMany'>>,
                    options: PaginationOptions
                ): Promise<
                    {
                        data: Prisma.Result<T, A, 'findMany'>;
                        meta: { total: number; page: number; perPage: number; }
                    }> {
                    const args: any = arg;
                    const context: any = Prisma.getExtensionContext(this);

                    const page = Number(options.page) || 1;
                    const perPage = Number(options.perPage) || 10;
                    const skip = page > 0 ? perPage * (page - 1) : 0;

                    const countArgs = args && args.where ? { where: args.where } : {};

                    const [total, data] = await client.$transaction([
                        context.count(countArgs),
                        context.findMany({
                            ...args,
                            take: perPage,
                            skip,
                        }),
                    ]);

                    return {
                        data,
                        meta: {
                            total,
                            page,
                            perPage
                        }
                    };
                },
            },
        },
    });
});
```

#### Service Implementation
```typescript
import { PaginationType } from "@/interfaces/http/schemas/pagination";
import { Prisma } from "@prisma/client";

findAll(pagination: PaginationType) {
  const { search, page, perPage } = pagination;

  let where: Prisma.UserWhereInput = {};

  if (search) {
    where = {
      ...where,
      OR: [
        { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ]
    }
  }

  return this.prisma.user.paginate({ where, orderBy: { createdAt: 'desc' } }, { page, perPage });
}
```

### 8. Internationalization Usage
```typescript
// In error handlers
throw new AppError(translate(lang, "USER_NOT_FOUND"), 404);

// In validation messages
const message = translateValidation(lang, "required").replace('{field}', fieldName);
```

This comprehensive DDD pattern provides a solid foundation for building scalable, maintainable APIs with proper separation of concerns, robust error handling, and clean architecture principles.
