import { pinoLogger } from 'hono-pino';
import pino from 'pino';
import pretty from 'pino-pretty';

export function logger(page_one: string) {
  return pinoLogger({
    pino: pino({
      level: 'debug',
    }),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
