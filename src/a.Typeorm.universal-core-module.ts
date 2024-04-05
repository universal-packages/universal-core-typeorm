import { CoreModule } from '@universal-packages/core'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'
import { TypeormModuleConfig } from './Typeorm.types'
import { TypeormLogger } from './TypeormLogger'

export default class TypeormModule extends CoreModule<TypeormModuleConfig> {
  public static readonly moduleName = 'typeorm-module'
  public static readonly description = 'Typeorm core module wrappers'

  public subject: DataSource

  public async prepare(): Promise<void> {
    if (this.config) {
      this.subject = new DataSource({ ...this.config.dataSource, logger: new TypeormLogger(this.logger) })

      // We avoid to initialize the subject if we are in the task
      // so it doesn't complain about the missing db if we are creating it
      if (!global['CORE_TYPE_ORM_TASK']) {
        await this.subject.initialize()
      }
    } else {
      this.logger.log({ level: 'WARNING', title: 'Typeorm configuration pending', category: 'TYPEORM' }, LOG_CONFIGURATION)
    }
  }

  public async release(): Promise<void> {
    if (this.subject && this.subject.isInitialized) await this.subject.destroy()
  }
}
