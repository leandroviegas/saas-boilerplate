# Locales Documentation

## Overview
Locales provide internationalization (i18n) support by mapping error codes and messages to user-friendly text in different languages. The system automatically creates missing translations and supports runtime language switching.

## Architecture Pattern

### Translation Function
Central `translate` function handles all localization:

```typescript
function translate(lang: string, errorCode: string): string
```

### Dynamic Translation Loading
Translations are loaded from JSON files at runtime:
```
locales/
├── index.ts          # Translation logic
├── en/
│   └── common.json   # English translations
└── pt/
    └── common.json   # Portuguese translations
```

## Translation Files

### JSON Structure
Translation files contain key-value pairs:
```json
{
    "VALIDATION_ERROR": "VALIDATION_ERROR",
    "USER_ALREADY_EXISTS": "USER_ALREADY_EXISTS",
    "INTERNAL_SERVER_ERROR": "INTERNAL_SERVER_ERROR"
}
```

### Auto-Creation Pattern
Missing translations are automatically added to files:
```typescript
// If errorCode doesn't exist, it's added with errorCode as value
if (!errorMessages[errorCode]) {
    errorMessages[errorCode] = errorCode;
    fs.writeFileSync(localeFile, JSON.stringify(errorMessages, null, 2));
}
```

## Usage Patterns

### Error Handler Integration
Translations are used in error handlers:
```typescript
import { translate } from "@/locales";

const message = translate(request.lang, errorCode);
```

### Language Detection
Language is extracted from request context:
```typescript
// Set by middleware
request.lang = "en"; // or "pt", etc.
```

## File Organization

### Language Directories
Each supported language has its own directory:
- `en/` - English translations
- `pt/` - Portuguese translations
- Add new languages by creating new directories

### Common Translation File
All translations are stored in `common.json` per language.

## Development Workflow

### Adding New Messages
1. Use a new error code in your code
2. System automatically adds it to all locale files with the code as default value
3. Manually translate the values in each language file

### Translation Keys
- Use UPPER_SNAKE_CASE for error codes
- Use descriptive, unique keys
- Group related messages logically

## Integration Points

### Error Handlers
Error handlers use translations for user-facing messages:
```typescript
const { code, status, validations } = handleValidationError(error, request.lang);
```

### Response Messages
Success and error responses can include translated messages.

## Best Practices
- Use descriptive error codes as keys
- Keep translations consistent across languages
- Regularly review and update translations
- Use the auto-creation feature during development
- Test translations in different languages
- Document new error codes when adding them