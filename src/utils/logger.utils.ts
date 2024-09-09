import { Logger } from '@nestjs/common';

const logger = new Logger('AppLogger');

export function logInfo(message: string): void {
  logger.log(message);
}

export function logError(message: string, trace: string): void {
  logger.error(message, trace);
}
