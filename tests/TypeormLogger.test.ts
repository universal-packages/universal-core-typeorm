import { Logger } from '@universal-packages/logger'

import { TypeormLogger } from '../src/TypeormLogger'

describe(TypeormLogger, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    const logger = new Logger({ silence: true })
    const tLogger = new TypeormLogger(logger)

    tLogger.log('info', '')
    tLogger.log('warn', '')
    tLogger.logMigration('')
    tLogger.logQuery('')
    tLogger.logQueryError(new Error(), '')
    tLogger.logQuerySlow(0, '')
    tLogger.logSchemaBuild('')
  })
})
