import { CoreInitializer } from '@universal-packages/core'

export default class TypeormInitializer extends CoreInitializer {
  public static readonly initializerName = 'typeorm'
  public static readonly description: string = 'Core TypeORM initializer'

  public readonly templatesLocation: string = `${__dirname}/templates`

  private type: string
  private typeMapEntry: { driver: string; package: string }

  private readonly TYPES_MAP = {
    postgres: {
      driver: 'postgres',
      package: 'pg'
    },
    mysql: {
      driver: 'mysql',
      package: 'mysql2'
    },
    mariadb: {
      driver: 'mariadb',
      package: 'mysql2'
    },
    sqlite: {
      driver: 'sqlite',
      package: 'sqlite3'
    },
    mssql: {
      driver: 'mssql',
      package: 'mssql'
    }
  }

  public async beforeTemplatePopulate(): Promise<void> {
    this.type = this.args['type'] || 'postgres'
    this.templateVariables['type'] = this.type
    this.typeMapEntry = this.TYPES_MAP[this.type]

    if (!this.typeMapEntry) {
      this.logger.log({ level: 'WARNING', title: 'Unknown type', message: `Unknown type ${this.type}. Postgres will be used by default.` })

      this.type = 'postgres'
      this.templateVariables['type'] = this.type
    }
  }

  public async afterTemplatePopulate(): Promise<void> {
    core.developer.terminalPresenter.startProgressIncreaseSimulation(100, 5000)

    await core.developer.terminalPresenter.runSubProcess({ command: 'npm', args: ['install', this.typeMapEntry.package] })

    core.developer.terminalPresenter.finishProgressIncreaseSimulation()
  }
}
