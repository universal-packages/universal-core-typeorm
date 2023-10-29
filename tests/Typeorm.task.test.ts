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

const coreConfigOverride = {
  config: { location: './tests/__fixtures__/config' },
  modules: { location: './tests/__fixtures__' },
  tasks: { location: './tests/__fixtures__' },
  environments: { location: './tests/__fixtures__' },
  logger: { silence: true }
}

describe(TypeormTask, (): void => {
  it('init', async (): Promise<void> => {
    await jestCore.execTask('typeorm-task', { directive: 'init', args: { f: true }, coreConfigOverride })
    expect(populateTemplates).toHaveBeenCalledWith(expect.stringMatching(/universal-core-typeorm\/src\/template/), './src', { override: true })

    await jestCore.execTask('typeorm-task', { directive: 'cache:clear', args: {}, coreConfigOverride })
    expect(CacheClearCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'entity:create', args: { name: 'b' }, coreConfigOverride })
    expect(EntityCreateCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'migration:create', args: { name: 'b' }, coreConfigOverride })
    expect(MigrationCreateCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'migration:generate', args: { name: 'b' }, coreConfigOverride })
    expect(MigrationGenerateCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'migration:revert', args: {}, coreConfigOverride })
    expect(MigrationRevertCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'migration:run', args: {}, coreConfigOverride })
    expect(MigrationRunCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'migration:show', args: {}, coreConfigOverride })
    expect(MigrationShowCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'query', args: {}, coreConfigOverride })
    expect(QueryCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'schema:drop', args: {}, coreConfigOverride })
    expect(SchemaDropCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'schema:log', args: {}, coreConfigOverride })
    expect(SchemaLogCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'schema:sync', args: {}, coreConfigOverride })
    expect(SchemaSyncCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'subscriber:create', args: { name: 'b' }, coreConfigOverride })
    expect(SubscriberCreateCommand).toHaveBeenCalled()

    await jestCore.execTask('typeorm-task', { directive: 'version', args: {}, coreConfigOverride })
    expect(VersionCommand).toHaveBeenCalled()
  })

  it('throws an error if directive is not recognized', async (): Promise<void> => {
    await expect(jestCore.execTask('typeorm-task', { directive: 'nop', args: { f: true }, coreConfigOverride })).rejects.toThrow('Unrecognized Typeorm command')
  })
})
