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

export default class TypeormTask extends CoreTask {
  public static readonly taskName = 'typeorm-task'
  public static readonly description = 'Typeorm cli commands analogic task'

  public async prepare(): Promise<void> {
    if (typeormModule.dataSource && typeormModule.dataSource.isInitialized) await typeormModule.dataSource.destroy()
    CommandUtils.loadDataSource = async (): Promise<DataSource> => typeormModule.dataSource
    // console.log = (...entries: string[]): void => this.logger.publish('INFO', null, entries.join(' '), 'TYPEORM')
  }

  public async exec(): Promise<void> {
    switch (this.directive) {
      case 'init':
        await populateTemplates(path.resolve(__dirname, 'template'), './src', { override: this.args.f })
        this.logger.publish('INFO', 'Typeorm template initialized')
        break
      case 'cache:clear':
        await new CacheClearCommand().handler({ ...this.args } as any)
        break
      case 'entity:create':
        await new EntityCreateCommand().handler({ path: path.join(typeormModule.config.entitiesDir, this.args.name || this.args.n) } as any)
        break
      case 'migration:create':
        await new MigrationCreateCommand().handler({ path: path.join(typeormModule.config.migrationsDir, this.args.name || this.args.n), ...this.args } as any)
        break
      case 'migration:generate':
        await new MigrationGenerateCommand().handler({ path: path.join(typeormModule.config.migrationsDir, this.args.name || this.args.n), ...this.args } as any)
        break
      case 'migration:revert':
        await new MigrationRevertCommand().handler({ ...this.args } as any)
        break
      case 'migration:run':
        await new MigrationRunCommand().handler({ ...this.args } as any)
        break
      case 'migration:show':
        await new MigrationShowCommand().handler({ ...this.args } as any)
        break
      case 'query':
        await new QueryCommand().handler({ ...this.args } as any)
        break
      case 'schema:drop':
        await new SchemaDropCommand().handler({ ...this.args } as any)
        break
      case 'schema:log':
        await new SchemaLogCommand().handler({ ...this.args } as any)
        break
      case 'schema:sync':
        await new SchemaSyncCommand().handler({ ...this.args } as any)
        break
      case 'subscriber:create':
        await new SubscriberCreateCommand().handler({ path: path.join(typeormModule.config.subscribersDir, this.args.name || this.args.n) } as any)
        break
      case 'version':
        await new VersionCommand().handler()
        break
      default:
        throw new Error('Unrecognized Typeorm command')
    }
  }
}
