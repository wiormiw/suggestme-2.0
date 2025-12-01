import { log } from './standalone.logger';

export function normalizeErrorLog(e: unknown, contextMessage: string) {
  // Initialize the logging object
  let logObject: any = {};
  let message = `🚨 ${contextMessage}`;

  if (e instanceof Error) {
    // If it's a standard Error, use the 'error' key for Pino serialization (stack trace)
    logObject.error = e;
    message += `: ${e.message}`; // Append the specific error message
  } else {
    // If it's NOT an Error (e.g., rejected string), log the raw value under 'data'
    logObject.data = e;
    message += `: Unknown type of error/rejection occurred`;
  }

  // Log the error
  log.error(logObject, message);
}
