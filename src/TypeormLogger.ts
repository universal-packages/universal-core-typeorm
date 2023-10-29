import { Logger } from '@universal-packages/logger'
import { Measurement } from '@universal-packages/time-measurer'
import { QueryRunner, Logger as TOL } from 'typeorm'

export class TypeormLogger implements TOL {
  private readonly logger: Logger
  private readonly empty: boolean

  public constructor(logger: Logger, empty?: boolean) {
    this.logger = logger
    this.empty = !!empty
  }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    if (this.empty) return
    this.logger.publish('QUERY', null, query, 'TYPEORM', { metadata: parameters })
  }
  /**
   * Logs query that is failed.
   */
  logQueryError(error: Error, query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    if (this.empty) return
    this.logger.publish('ERROR', null, query, 'TYPEORM', { error, metadata: parameters })
  }
  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[], _queryRunner?: QueryRunner): any {
    if (this.empty) return
    const measurement = new Measurement(BigInt(time) * 10000n)
    this.logger.publish('WARNING', null, query, 'TYPEORM', { metadata: parameters, measurement })
  }
  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, _queryRunner?: QueryRunner): any {
    if (this.empty) return
    this.logger.publish('QUERY', null, message, 'TYPEORM')
  }
  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, _queryRunner?: QueryRunner): any {
    if (this.empty) return
    this.logger.publish('QUERY', null, message, 'TYPEORM')
  }
  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any, _queryRunner?: QueryRunner): any {
    if (this.empty) return
    switch (level) {
      case 'log':
      case 'info':
        this.logger.publish('INFO', null, message, 'TYPEORM')
        break
      case 'warn':
        this.logger.publish('WARNING', null, message, 'TYPEORM')
    }
  }
}
