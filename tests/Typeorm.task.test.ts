import { Logger } from '@universal-packages/logger'
import { populateTemplates } from '@universal-packages/template-populator'
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

import { TypeormModule } from '../src'
import TypeormTask from '../src/Typeorm.universal-core-task'

jest.mock('typeorm')
jest.mock('@universal-packages/template-populator')
jest.mock('typeorm/commands/CacheClearCommand')
jest.mock('typeorm/commands/EntityCreateCommand')
jest.mock('typeorm/commands/MigrationCreateCommand')
jest.mock('typeorm/commands/MigrationGenerateCommand')
jest.mock('typeorm/commands/MigrationRevertCommand')
jest.mock('typeorm/commands/MigrationRunCommand')
jest.mock('typeorm/commands/MigrationShowCommand')
jest.mock('typeorm/commands/QueryCommand')
jest.mock('typeorm/commands/SchemaDropCommand')
jest.mock('typeorm/commands/SchemaLogCommand')
jest.mock('typeorm/commands/SchemaSyncCommand')
jest.mock('typeorm/commands/SubscriberCreateCommand')
jest.mock('typeorm/commands/VersionCommand')

describe('TypeormTask', (): void => {
  it('behaves as expected', async (): Promise<void> => {
    const logger = new Logger({ silence: true })
    const typeormModule = new TypeormModule({ entitiesDir: 'a', migrationsDir: 'a', subscribersDir: 'a' } as any, logger)
    global.core = { coreModules: { typeormModule } } as any
    typeormModule.prepare()

    let task = new TypeormTask('init', [], {}, logger)
    await task.exec()
    expect(populateTemplates).toHaveBeenCalled()

    task = new TypeormTask('cache:clear', [], {}, logger)
    await task.exec()
    expect(CacheClearCommand).toHaveBeenCalled()

    task = new TypeormTask('entity:create', [], { name: 'b' }, logger)
    await task.exec()
    expect(EntityCreateCommand).toHaveBeenCalled()

    task = new TypeormTask('migration:create', [], { name: 'b' }, logger)
    await task.exec()
    expect(MigrationCreateCommand).toHaveBeenCalled()

    task = new TypeormTask('migration:generate', [], { name: 'b' }, logger)
    await task.exec()
    expect(MigrationGenerateCommand).toHaveBeenCalled()

    task = new TypeormTask('migration:revert', [], {}, logger)
    await task.exec()
    expect(MigrationRevertCommand).toHaveBeenCalled()

    task = new TypeormTask('migration:run', [], {}, logger)
    await task.exec()
    expect(MigrationRunCommand).toHaveBeenCalled()

    task = new TypeormTask('migration:show', [], {}, logger)
    await task.exec()
    expect(MigrationShowCommand).toHaveBeenCalled()

    task = new TypeormTask('query', [], {}, logger)
    await task.exec()
    expect(QueryCommand).toHaveBeenCalled()

    task = new TypeormTask('schema:drop', [], {}, logger)
    await task.exec()
    expect(SchemaDropCommand).toHaveBeenCalled()

    task = new TypeormTask('schema:log', [], {}, logger)
    await task.exec()
    expect(SchemaLogCommand).toHaveBeenCalled()

    task = new TypeormTask('schema:sync', [], {}, logger)
    await task.exec()
    expect(SchemaSyncCommand).toHaveBeenCalled()

    task = new TypeormTask('subscriber:create', [], { name: 'b' }, logger)
    await task.exec()
    expect(SubscriberCreateCommand).toHaveBeenCalled()

    task = new TypeormTask('version', [], {}, logger)
    await task.exec()
    expect(VersionCommand).toHaveBeenCalled()

    typeormModule.release()
  })
})
