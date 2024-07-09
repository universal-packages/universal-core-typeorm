import os from 'os'
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

import TypeormTask from '../../src/Typeorm.universal-core-task'

jest.mock('typeorm')
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

const coreConfigOverride = {
  config: { location: './tests/__fixtures__/config' },
  modules: { location: './tests/__fixtures__' },
  tasks: { location: './tests/__fixtures__' },
  environments: { location: './tests/__fixtures__' },
  logger: { silence: true }
}

process.env['SELF_TEST'] = 'true'

describe(TypeormTask, (): void => {
  it('typeorm-cli', async (): Promise<void> => {
    await coreJest.execTask('typeorm', { directive: 'cache:clear', args: {}, coreConfigOverride })
    expect(CacheClearCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'entity:create', args: { name: 'b' }, coreConfigOverride })
    expect(EntityCreateCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'migration:create', args: { name: 'b' }, coreConfigOverride })
    expect(MigrationCreateCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'migration:generate', args: { name: 'b' }, coreConfigOverride })
    expect(MigrationGenerateCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'migration:revert', args: {}, coreConfigOverride })
    expect(MigrationRevertCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'migration:run', args: {}, coreConfigOverride })
    expect(MigrationRunCommand).toHaveBeenCalledTimes(1 + os.cpus().length)

    await coreJest.execTask('typeorm', { directive: 'migration:show', args: {}, coreConfigOverride })
    expect(MigrationShowCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'query', args: {}, coreConfigOverride })
    expect(QueryCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'schema:drop', args: {}, coreConfigOverride })
    expect(SchemaDropCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'schema:log', args: {}, coreConfigOverride })
    expect(SchemaLogCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'schema:sync', args: {}, coreConfigOverride })
    expect(SchemaSyncCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'subscriber:create', args: { name: 'b' }, coreConfigOverride })
    expect(SubscriberCreateCommand).toHaveBeenCalled()

    await coreJest.execTask('typeorm', { directive: 'version', args: {}, coreConfigOverride })
    expect(VersionCommand).toHaveBeenCalled()
  })
})
