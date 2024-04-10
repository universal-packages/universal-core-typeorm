import { Logger } from '@universal-packages/logger'
import { Measurement } from '@universal-packages/time-measurer'
import { QueryRunner, Logger as TOL } from 'typeorm'

import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'

export class TypeormLogger implements TOL {
  private readonly logger: Logger

  public constructor(logger: Logger) {
    this.logger = logger
  }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    this.logger.log({ level: 'QUERY', message: query, category: 'TYPEORM', metadata: parameters }, LOG_CONFIGURATION)
  }
  /**
   * Logs query that is failed.
   */
  logQueryError(error: Error, query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    this.logger.log({ level: 'ERROR', message: query, category: 'TYPEORM', error, metadata: parameters }, LOG_CONFIGURATION)
  }
  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    const measurement = new Measurement(BigInt(time) * 10000n)
    this.logger.log({ level: 'WARNING', message: query, category: 'TYPEORM', metadata: parameters, measurement }, LOG_CONFIGURATION)
  }
  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, _queryRunner?: QueryRunner): any {
    this.logger.log({ level: 'QUERY', message, category: 'TYPEORM' }, LOG_CONFIGURATION)
  }
  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, _queryRunner?: QueryRunner): any {
    this.logger.log({ level: 'QUERY', message, category: 'TYPEORM' }, LOG_CONFIGURATION)
  }
  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner): any {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.log({ level: 'INFO', message, category: 'TYPEORM' }, LOG_CONFIGURATION)
        break
      case 'warn':
        this.logger.log({ level: 'WARNING', message, category: 'TYPEORM' }, LOG_CONFIGURATION)
    }
  }
}
