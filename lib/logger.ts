// @/lib/logger.ts
import { NextApiRequest } from 'next';

/**
 * Just. Clean. Logs.
 * Usage:
 * const logger = new Logger('mymodule');
 * logger.log('info', 'This is a log message', rawData);
 * @summary LOGS!
 * @param {string} stat - Application or module the log data is coming from
 */
enum LogLevel {
  INFO,
  WARN,
  DEBUG,
  SENSITIVE,
}

const logLevels = Object.values(LogLevel);
const logLevel = (process.env.LOG_LEVEL || 'info').toUpperCase() as unknown as LogLevel;

class Logger {
  private stat: string;

  constructor(stat: string) {
    this.stat = stat.toUpperCase();
  }

  /**
   * @summary Log to console
   * @param {string} level - Log level i.e WARN, INFO, DEBUG, ERROR etc.
   * @param {string} message - Log message
   * @param {NextApiRequest} [req] - NextJS request object
   */
  log(level: LogLevel, message: string, req?: NextApiRequest, rawData?: any) {
    if (logLevels.indexOf(level) <= logLevels.indexOf(logLevel)) {
      const timestamp = new Date().toISOString();
      const requestId = req?.headers.get('x-request-id') || '-';
      const logMessage = `${timestamp} ${requestId} ${level}:${this.stat}:${message.replace(/(\r\n|\n|\r)/gm, '')}`;
      console.log(logMessage);
      if (rawData) {
        console.log(rawData);
      }
    }
  }
}

export default Logger;
