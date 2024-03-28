import { CoreTask } from '@universal-packages/core'
import { populateTemplates } from '@universal-packages/template-populator'
import { exec } from 'child_process'
import os from 'os'
import path from 'path'
import { DataSource } from 'typeorm'
import { CacheClearCommand } from 'typeorm/commands/CacheClearCommand'
import { CommandUtils } from 'typeorm/commands/CommandUtils'
import { EntityCreateCommand } from 'typeorm/commands/EntityCreateCommand'
import { MigrationCreateCommand } from 'typeorm/commands/MigrationCreateCommand'
import { MigrationGenerateCommand } from 'typeorm/commands/MigrationGenerateCommand'
import { MigrationRevertCommand } from 'typeorm/commands/MigrationRevertCommand'
import { MigrationRunCommand } from 'typeorm/commands/MigrationRunCommand'
import { MigrationShowCommand } from 'typeorm/commands/MigrationShowCommand'
import { QueryCommand } from 'typeorm/commands/QueryCommand'
import { SchemaDropCommand } from 'typeorm/commands/SchemaDropCommand'
import { SchemaLogCommand } from 'typeorm/commands/SchemaLogCommand'
import { SchemaSyncCommand } from 'typeorm/commands/SchemaSyncCommand'
import { SubscriberCreateCommand } from 'typeorm/commands/SubscriberCreateCommand'
import { VersionCommand } from 'typeorm/commands/VersionCommand'

import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'
import { TypeormLogger } from './TypeormLogger'
import TypeormModule from './a.Typeorm.universal-core-module'

export default class TypeormTask extends CoreTask {
  public static readonly taskName = 'typeorm-task'
  public static readonly description = 'Typeorm cli commands analogic task'

  private dataSource: DataSource
  private typeormModule: TypeormModule

  public async exec(): Promise<void> {
    this.typeormModule = core.coreModules.typeormModule as TypeormModule
    this.dataSource = this.typeormModule.subject
    CommandUtils.loadDataSource = async (): Promise<DataSource> => this.dataSource
    console.log = (...entries: string[]): void => this.logger.log({ level: 'INFO', message: entries.join(' '), category: 'TYPEORM' }, LOG_CONFIGURATION)
    const actualExit = process.exit
    process.exit = ((code?: number): void => {
      if (code) actualExit(code)
    }) as any

    switch (this.directive) {
      case 'init':
        await populateTemplates(path.resolve(__dirname, 'template'), './src', { override: this.args.f })
        this.logger.log({ level: 'INFO', title: 'Typeorm template initialized', category: 'TYPEORM' }, LOG_CONFIGURATION)
        break
      case 'db:create':
        await this.createDB(this.typeormModule.config.dataSource.type, this.typeormModule.config.dataSource.database as string)

        if (process.env['NODE_ENV'] === 'development') {
          await this.createTestDB()
        }
        break
      case 'db:drop':
        await this.dropDB(this.typeormModule.config.dataSource.type, this.typeormModule.config.dataSource.database as string)

        if (process.env['NODE_ENV'] === 'development') {
          await this.dropTestDB()
        }
        break
      case 'cache:clear':
        await new CacheClearCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'entity:create':
        await new EntityCreateCommand().handler({ path: path.join(this.typeormModule.config.entitiesDir, this.args.name || this.args.n), dataSource: '' } as any)
        break
      case 'migration:create':
        await new MigrationCreateCommand().handler({ path: path.join(this.typeormModule.config.migrationsDir, this.args.name || this.args.n), ...this.args, dataSource: '' } as any)
        break
      case 'migration:generate':
        await new MigrationGenerateCommand().handler({
          path: path.join(this.typeormModule.config.migrationsDir, this.directiveOptions[0] || ''),
          ...this.args,
          dataSource: ''
        } as any)
        break
      case 'migration:revert':
        await new MigrationRevertCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'migration:run':
        await new MigrationRunCommand().handler({ ...this.args, dataSource: '' } as any)

        if (process.env['NODE_ENV'] === 'development') {
          await this.migrateTestDB()
        }
        break
      case 'migration:show':
        await new MigrationShowCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'query':
        await new QueryCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'schema:drop':
        await new SchemaDropCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'schema:log':
        await new SchemaLogCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'schema:sync':
        await new SchemaSyncCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'subscriber:create':
        await new SubscriberCreateCommand().handler({ path: path.join(this.typeormModule.config.subscribersDir, this.args.name || this.args.n), dataSource: '' } as any)
        break
      case 'version':
        await new VersionCommand().handler()
        break
      default:
        throw new Error('Unrecognized Typeorm command')
    }
  }

  private async createDB(type: string, name: string): Promise<void> {
    let options = ''
    let environment = {}

    switch (type) {
      case 'postgres':
        if (this.typeormModule.config.dataSource['username']) options += ` -U ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) environment['PGPASSWORD'] = this.typeormModule.config.dataSource['password']
        if (this.typeormModule.config.dataSource['host']) options += ` -h ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -p ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`createdb ${name} ${options}`, environment)
        break
      case 'mysql':
        if (this.typeormModule.config.dataSource['username']) options += ` -u ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) options += ` -p${this.typeormModule.config.dataSource['password']}`
        if (this.typeormModule.config.dataSource['host']) options += ` -h ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -P ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`mysql -e "CREATE DATABASE IF NOT EXISTS ${name};" ${options}`)
        break
      case 'mariadb':
        if (this.typeormModule.config.dataSource['username']) options += ` -u ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) options += ` -p${this.typeormModule.config.dataSource['password']}`
        if (this.typeormModule.config.dataSource['host']) options += ` -h ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -P ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`mysql -e "CREATE DATABASE IF NOT EXISTS ${name};" ${options}`)
        break
      case 'sqlite':
        await this.execCommand(`touch ${name}`)
        break
      case 'mssql':
        if (this.typeormModule.config.dataSource['username']) options += ` -U ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) options += ` -P ${this.typeormModule.config.dataSource['password']}`
        if (this.typeormModule.config.dataSource['host']) options += ` -S ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -P ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`sqlcmd -Q "CREATE DATABASE ${name};" ${options}`)
        break
      default:
        throw new Error('Unrecognized database type')
    }

    this.logger.log({ level: 'QUERY', title: 'Database created', message: name, category: 'TYPEORM', metadata: { type, name } }, LOG_CONFIGURATION)
  }

  private async dropDB(type: string, name: string): Promise<void> {
    let options = ''
    let environment = {}

    switch (type) {
      case 'postgres':
        if (this.typeormModule.config.dataSource['username']) options += ` -U ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) environment['PGPASSWORD'] = this.typeormModule.config.dataSource['password']
        if (this.typeormModule.config.dataSource['host']) options += ` -h ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -p ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`dropdb ${name} ${options}`, environment)
        break
      case 'mysql':
        if (this.typeormModule.config.dataSource['username']) options += ` -u ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) options += ` -p${this.typeormModule.config.dataSource['password']}`
        if (this.typeormModule.config.dataSource['host']) options += ` -h ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -P ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`mysql -e "DROP DATABASE IF EXISTS ${name};" ${options}`)
        break
      case 'mariadb':
        if (this.typeormModule.config.dataSource['username']) options += ` -u ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) options += ` -p${this.typeormModule.config.dataSource['password']}`
        if (this.typeormModule.config.dataSource['host']) options += ` -h ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -P ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`mysql -e "DROP DATABASE IF EXISTS ${name};" ${options}`)
        break
      case 'sqlite':
        await this.execCommand(`rm ${name}`)
        break
      case 'mssql':
        if (this.typeormModule.config.dataSource['username']) options += ` -U ${this.typeormModule.config.dataSource['username']}`
        if (this.typeormModule.config.dataSource['password']) options += ` -P ${this.typeormModule.config.dataSource['password']}`
        if (this.typeormModule.config.dataSource['host']) options += ` -S ${this.typeormModule.config.dataSource['host']}`
        if (this.typeormModule.config.dataSource['port']) options += ` -P ${this.typeormModule.config.dataSource['port']}`

        await this.execCommand(`sqlcmd -Q "DROP DATABASE ${name};" ${options}`)
        break
      default:
        throw new Error('Unrecognized database type')
    }

    this.logger.log({ level: 'QUERY', title: 'Database dropped', message: name, category: 'TYPEORM', metadata: { type, name } }, LOG_CONFIGURATION)
  }

  private async createTestDB(): Promise<void> {
    const typeormModule = core.coreModules.typeormModule as TypeormModule
    const type = typeormModule.config.dataSource.type
    const baseName = typeormModule.config.dataSource.database as string
    const cpuCount = os.cpus().length

    for (let i = 1; i <= cpuCount; i++) {
      const testDbName = this.getDBName(baseName, i)

      try {
        await this.createDB(type, testDbName)
      } catch (error) {
        this.logger.log({ level: 'WARNING', title: 'Create db error', message: error.message, category: 'TYPEORM' }, LOG_CONFIGURATION)
      }
    }
  }

  private async dropTestDB(): Promise<void> {
    const typeormModule = core.coreModules.typeormModule as TypeormModule
    const type = typeormModule.config.dataSource.type
    const baseName = typeormModule.config.dataSource.database as string
    const cpuCount = os.cpus().length

    for (let i = 1; i <= cpuCount; i++) {
      const testDbName = this.getDBName(baseName, i)

      try {
        await this.dropDB(type, testDbName)
      } catch (error) {
        this.logger.log({ level: 'WARNING', title: 'Drop db error', message: error.message, category: 'TYPEORM' }, LOG_CONFIGURATION)
      }
    }
  }

  private async migrateTestDB(): Promise<void> {
    const typeormModule = core.coreModules.typeormModule as TypeormModule
    const baseName = typeormModule.config.dataSource.database as string
    const cpuCount = os.cpus().length

    for (let i = 1; i <= cpuCount; i++) {
      const testDbName = this.getDBName(baseName, i)
      this.dataSource = new DataSource({ ...typeormModule.config.dataSource, database: testDbName as any, logger: new TypeormLogger(this.logger, true) })

      await new MigrationRunCommand().handler({ ...this.args, dataSource: '' } as any)

      this.logger.log({ level: 'QUERY', title: 'Test database migrated', measurement: testDbName, category: 'TYPEORM' }, LOG_CONFIGURATION)
    }
  }

  private execCommand(command: string, env: Record<string, any> = {}): Promise<void> {
    return new Promise((resolve, reject): void => {
      exec(command, { env: { ...process.env, ...env } }, (error: Error): void => {
        if (error) reject(error)
        resolve()
      })
    })
  }

  private getDBName(baseName: string, cpuIndex: number): string {
    const baseTestDBName = baseName.includes('development') ? baseName.replace(/development/, 'test') : `${baseName}-test`
    return `${baseTestDBName}-${cpuIndex}`
  }
}
