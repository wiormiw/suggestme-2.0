import { logConfig } from '@/config';
import { createPinoLogger } from '@bogeychan/elysia-logger';

export const log = createPinoLogger(logConfig);
