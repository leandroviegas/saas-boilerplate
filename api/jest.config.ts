import type { Config } from 'jest';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: Config = {
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          esModuleInterop: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': path.resolve(__dirname, './src/$1'),
  },
  testMatch: [
    '**/tests/**/*.test.ts',
  ],
  setupFilesAfterEnv: [],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};

export default config;
