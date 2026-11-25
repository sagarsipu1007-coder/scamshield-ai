import type { ProcessEnv } from 'node:process';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Reserved for future backend integration.
    }
  }
}

export {};
