import { CoreModule } from '@universal-packages/core'
import { TerminalTransport } from '@universal-packages/logger'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { TypeormModuleConfig } from './Typeorm.types'
import { TypeormLogger } from './TypeormLogger'

export default class TypeormModule extends CoreModule<TypeormModuleConfig> {
  public static readonly moduleName = 'typeorm-module'
  public static readonly description = 'Typeorm core module wrappers'

  public subject: DataSource

  public async prepare(): Promise<void> {
    const terminalTransport = this.logger.getTransport('terminal') as TerminalTransport
    terminalTransport.options.categoryColors['TYPEORM'] = 'PURPLE'

    if (this.config) {
      this.subject = new DataSource({ ...this.config.dataSource, logger: new TypeormLogger(this.logger) })

      // We avoid to initialize the subject if we are in the task
      // so it doesn't complain about the missing db if we are creating it
      if (!global['TYPE_ORM_TASK']) {
        await this.subject.initialize()
      }
    } else {
      this.logger.publish('WARNING', 'Typeorm configuration pending')
    }
  }

  public async release(): Promise<void> {
    if (this.subject && this.subject.isInitialized) await this.subject.destroy()
  }
}
