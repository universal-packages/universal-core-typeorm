import { exec } from 'child_process'
import os from 'os'
import { CoreTask } from '@universal-packages/core'
import { populateTemplates } from '@universal-packages/template-populator'
import path from 'path'
import { DataSource } from 'typeorm'
import { CommandUtils } from 'typeorm/commands/CommandUtils'
import { CacheClearCommand } from 'typeorm/commands/CacheClearCommand'
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
import TypeormModule from './a.Typeorm.universal-core-module'

export default class TypeormTask extends CoreTask {
  public static readonly taskName = 'typeorm-task'
  public static readonly description = 'Typeorm cli commands analogic task'

  public async exec(): Promise<void> {
    const typeormModule = core.coreModules.typeormModule as TypeormModule
    await typeormModule.subject.destroy()
    CommandUtils.loadDataSource = async (): Promise<DataSource> => typeormModule.subject
    console.log = (...entries: string[]): void => this.logger.publish('INFO', null, entries.join(' '), 'TYPEORM')

    switch (this.directive) {
      case 'init':
        await populateTemplates(path.resolve(__dirname, 'template'), './src', { override: this.args.f })
        this.logger.publish('INFO', 'Typeorm template initialized')
        break
      case 'db:create':
        await this.createDB(typeormModule.config.dataSource.type, typeormModule.config.dataSource.database as string)

        if (process.env['NODE_ENV'] !== 'production') {
          await this.createTestDB(typeormModule.config.dataSource.type, typeormModule.config.dataSource.database as string)
        }
        break
      case 'db:drop':
        await this.dropDB(typeormModule.config.dataSource.type, typeormModule.config.dataSource.database as string)
        if (process.env['NODE_ENV'] !== 'production') {
          await this.dropTestDB(typeormModule.config.dataSource.type, typeormModule.config.dataSource.database as string)
        }
        break
      case 'cache:clear':
        await new CacheClearCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'entity:create':
        await new EntityCreateCommand().handler({ path: path.join(typeormModule.config.entitiesDir, this.args.name || this.args.n), dataSource: '' } as any)
        break
      case 'migration:create':
        await new MigrationCreateCommand().handler({ path: path.join(typeormModule.config.migrationsDir, this.args.name || this.args.n), ...this.args, dataSource: '' } as any)
        break
      case 'migration:generate':
        await new MigrationGenerateCommand().handler({ path: path.join(typeormModule.config.migrationsDir, this.directiveOptions[0] || ''), ...this.args, dataSource: '' } as any)
        break
      case 'migration:revert':
        await new MigrationRevertCommand().handler({ ...this.args, dataSource: '' } as any)
        break
      case 'migration:run':
        await new MigrationRunCommand().handler({ ...this.args, dataSource: '' } as any)
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
        await new SubscriberCreateCommand().handler({ path: path.join(typeormModule.config.subscribersDir, this.args.name || this.args.n), dataSource: '' } as any)
        break
      case 'version':
        await new VersionCommand().handler()
        break
      default:
        throw new Error('Unrecognized Typeorm command')
    }
  }

  private async createDB(type: string, name: string): Promise<void> {
    switch (type) {
      case 'postgres':
        await this.execCommand(`createdb ${name}`)
        break
      case 'mysql':
        await this.execCommand(`mysql -e "CREATE DATABASE IF NOT EXISTS ${name};"`)
        break
      case 'mariadb':
        await this.execCommand(`mysql -e "CREATE DATABASE IF NOT EXISTS ${name};"`)
        break
      case 'sqlite':
        await this.execCommand(`touch ${name}`)
        break
      case 'mssql':
        await this.execCommand(`sqlcmd -Q "CREATE DATABASE ${name}"`)
        break
      default:
        throw new Error('Unrecognized database type')
    }
  }

  private async dropDB(type: string, name: string): Promise<void> {
    switch (type) {
      case 'postgres':
        await this.execCommand(`dropdb ${name}`)
        break
      case 'mysql':
        await this.execCommand(`mysql -e "DROP DATABASE IF EXISTS ${name};"`)
        break
      case 'mariadb':
        await this.execCommand(`mysql -e "DROP DATABASE IF EXISTS ${name};"`)
        break
      case 'sqlite':
        await this.execCommand(`rm ${name}`)
        break
      case 'mssql':
        await this.execCommand(`sqlcmd -Q "DROP DATABASE ${name}"`)
        break
      default:
        throw new Error('Unrecognized database type')
    }
  }

  private async createTestDB(type: string, baseName: string): Promise<void> {
    const cpuCount = os.cpus().length

    for (let i = 1; i <= cpuCount; i++) {
      const baseTestDBName = baseName.includes('development') ? baseName.replace(/development/, 'test') : `${baseName}-test`
      const testDbName = `${baseTestDBName}-${i}`

      try {
        await this.createDB(type, testDbName)
      } catch (error) {
        this.logger.publish('WARNING', 'Create db error', error.message, 'TYPEORM')
      }
    }
  }

  private async dropTestDB(type: string, baseName: string): Promise<void> {
    const cpuCount = os.cpus().length

    for (let i = 1; i <= cpuCount; i++) {
      const baseTestDBName = baseName.includes('development') ? baseName.replace(/development/, 'test') : `${baseName}-test`
      const testDbName = `${baseTestDBName}-${i}`

      try {
        await this.dropDB(type, testDbName)
      } catch (error) {
        this.logger.publish('WARNING', 'Drop db error', error.message, 'TYPEORM')
      }
    }
  }

  private execCommand(command: string): Promise<void> {
    return new Promise((resolve, reject): void => {
      exec(command, (error: Error): void => {
        if (error) reject(error)
        resolve()
      })
    })
  }
}
