/**
 * Logging utility for color-coded console output
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export class Logger {
  private prefix = '🔗 [CRE]';

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private getColorCode(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: '\x1b[36m', // Cyan
      [LogLevel.INFO]: '\x1b[34m', // Blue
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.SUCCESS]: '\x1b[32m', // Green
    };
    return colors[level];
  }

  private resetColor = '\x1b[0m';

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = this.getTimestamp();
    const color = this.getColorCode(level);
    const levelDisplay = `${color}${level}${this.resetColor}`;

    const prefix = `${this.prefix} ${timestamp} ${levelDisplay}`;
    const output = `${prefix}: ${message}`;

    if (data) {
      console.log(output);
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log(output);
    }
  }

  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  public error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  public success(message: string, data?: any): void {
    this.log(LogLevel.SUCCESS, message, data);
  }

  public divider(): void {
    console.log('\n' + '─'.repeat(80) + '\n');
  }

  public header(title: string): void {
    this.divider();
    console.log(`\x1b[1m$$ ${title} $$\x1b[0m`);
    this.divider();
  }

  public section(title: string): void {
    console.log(`\n\x1b[1m📌 ${title}\x1b[0m`);
    console.log('─'.repeat(40));
  }

  public table(data: Record<string, any>): void {
    console.table(data);
  }
}

export const logger = new Logger();
