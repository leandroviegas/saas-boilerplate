const fs = require('fs');
const path = require('path');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const langs = {
  'en': 'English',
  'pt': 'Portuguese',
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

function extractTranslationsFromFile(content) {
  const translations = {};
  const regex = /\bt\s*\(\s*(['"`])([\s\S]*?)\1\s*(?:,\s*\[[\s\S]*?\])?\s*\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const text = match[2];
    translations[text] = text;
  }

  return translations;
}

function extractTranslationsFromFolder(folderPath) {
  const allFiles = getAllFiles(folderPath);
  const translations = {};

  allFiles.forEach((file) => {
    const ext = path.extname(file);
    if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
      const content = fs.readFileSync(file, 'utf-8');
      const fileTranslations = extractTranslationsFromFile(content);

      Object.assign(translations, fileTranslations);
    }
  });

  return translations;
}

async function translateTextsBatch(texts, targetLanguage) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in your .env file.');
    return {};
  }

  if (texts.length === 0) {
    return {};
  }

  const prompt = `Translate the following JSON object where keys are original texts and values are the same original texts, capitalize the first letter of each sentence/phrase (NOT EVERY WORD), and use all uppercase for abbreviations (EXAMPLE: NASA, USA). Translate the values only to ${targetLanguage}. Return the response as a JSON object. Examples: {"hello my name is jorge": "Hello my name is Jorge"}, {"hello my name is jorge": "Olá meu nome é Jorge"}\n\n${JSON.stringify(texts.reduce((acc, text) => ({ ...acc, [text]: text }), {}))}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }],
        }],
      }),
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const translatedText = data.candidates[0].content.parts[0].text;
      try {
        // Gemini might return markdown, so try to extract JSON from it
        const jsonMatch = translatedText.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : translatedText;
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Failed to parse JSON from Gemini response:', translatedText, parseError);
        // Fallback to individual translation if batch parsing fails
        const fallbackTranslations = {};
        for (const text of texts) {
          fallbackTranslations[text] = text; // Keep original if parsing fails
        }
        return fallbackTranslations;
      }
    } else {
      console.error('Batch translation failed for:', texts, data);
      const fallbackTranslations = {};
      for (const text of texts) {
        fallbackTranslations[text] = text;
      }
      return fallbackTranslations;
    }
  } catch (error) {
    console.error('Error during batch translation:', error);
    const fallbackTranslations = {};
    for (const text of texts) {
      fallbackTranslations[text] = text;
    }
    return fallbackTranslations;
  }
}

async function automateTranslations() {
  const targetFolder = path.resolve(__dirname, 'src');
  const extractedTranslation = extractTranslationsFromFolder(targetFolder);

  const localesPath = path.resolve(__dirname,'src', 'locales');
  const languageDirs = fs.readdirSync(localesPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const langDir of languageDirs) {
    const commonJsonPath = path.join(localesPath, langDir, 'common.json');
    let fileTranslations = {};

    if (fs.existsSync(commonJsonPath)) {
      fileTranslations = JSON.parse(fs.readFileSync(commonJsonPath, 'utf-8'));
    }

    const newFileTranslations = {};
    const nonTranslatedTextsArray = [];

    for (const key in extractedTranslation) {
      if (fileTranslations.hasOwnProperty(key)) {
        newFileTranslations[key] = fileTranslations[key];
      } else {
        nonTranslatedTextsArray.push(key);
      }
    }

    console.log(`Translating for language: ${langDir}`);
    const translatedNonTranslatedText = await translateTextsBatch(nonTranslatedTextsArray, langs[langDir] || langDir);

    const combinedTranslations = { ...newFileTranslations, ...translatedNonTranslatedText };

    fs.writeFileSync(
      commonJsonPath,
      JSON.stringify(combinedTranslations, null, 2),
      'utf-8'
    );
    console.log(`✅ Translations updated for ${langDir}/common.json`);
  }
}

automateTranslations();
