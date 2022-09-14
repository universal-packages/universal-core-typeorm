import { CoreModule } from '@universal-packages/core'
import { TerminalTransport } from '@universal-packages/logger'
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { TypeormModuleConfig } from './Typeorm.types'
import { TypeormLogger } from './TypeormLogger'

export default class TypeormModule extends CoreModule<TypeormModuleConfig> {
  public static readonly moduleName = 'typeorm-module'
  public static readonly description = 'Typeorm core module wrappers'

  public dataSource: DataSource

  public async prepare(): Promise<void> {
    const terminalTransport = this.logger.getTransport('terminal') as TerminalTransport
    terminalTransport.options.categoryColors['TYPEORM'] = 'PURPLE'

    if (this.config) {
      this.dataSource = new DataSource({ ...this.config.dataSource, logger: new TypeormLogger(this.logger) })
      await this.dataSource.initialize()
    } else {
      this.logger.publish('WARNING', 'Typeorm configuration pendding')
    }
  }

  public async release(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) await this.dataSource.destroy()
  }
}
