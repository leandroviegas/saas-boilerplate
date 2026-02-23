import { languageEnum } from '@/enums/languageEnum';
import logger from '@/plugins/logger';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

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