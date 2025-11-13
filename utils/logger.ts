// Logger utility
// Simple wrapper around console with different log levels

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = __DEV__;

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  debug(message: string, data?: any): void {
    if (!this.isDevelopment) return;

    const entry = this.formatMessage('debug', message, data);
    console.debug(`[DEBUG] ${entry.timestamp} - ${message}`, data || '');
  }

  info(message: string, data?: any): void {
    const entry = this.formatMessage('info', message, data);
    console.info(`[INFO] ${entry.timestamp} - ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    const entry = this.formatMessage('warn', message, data);
    console.warn(`[WARN] ${entry.timestamp} - ${message}`, data || '');
  }

  error(message: string, error?: Error | any): void {
    const entry = this.formatMessage('error', message, error);
    console.error(`[ERROR] ${entry.timestamp} - ${message}`, error || '');
  }
}

export const logger = new Logger();