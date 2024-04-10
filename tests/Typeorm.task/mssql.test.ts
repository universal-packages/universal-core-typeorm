import { SubProcess } from '@universal-packages/sub-process'
import os from 'os'

import TypeormTask from '../../src/Typeorm.universal-core-task'

jest.mock('typeorm')
jest.mock('@universal-packages/template-populator')

const coreConfigOverride = {
  config: { location: './tests/__fixtures__/config-mssql' },
  modules: { location: './tests/__fixtures__' },
  tasks: { location: './tests/__fixtures__' },
  environments: { location: './tests/__fixtures__' }
}

process.env['SELF_TEST'] = 'true'

describe(TypeormTask, (): void => {
  it('db:create', async (): Promise<void> => {
    await jestCore.execTask('typeorm-task', { directive: 'db:create', coreConfigOverride })

    expect(SubProcess).toHaveRun('sqlcmd -Q "CREATE DATABASE database;"  -U david -P <filtered> -S localhost -P 3306')

    const cpuCount = os.cpus().length

    for (let i = 0; i < cpuCount; i++) {
      expect(SubProcess).toHaveRun(`sqlcmd -Q "CREATE DATABASE database-test-${i + 1};"  -U david -P <filtered> -S localhost -P 3306`)
    }
  })

  it('db:drop', async (): Promise<void> => {
    await jestCore.execTask('typeorm-task', { directive: 'db:drop', coreConfigOverride })

    expect(SubProcess).toHaveRun('sqlcmd -Q "DROP DATABASE database;"  -U david -P <filtered> -S localhost -P 3306')

    const cpuCount = os.cpus().length

    for (let i = 0; i < cpuCount; i++) {
      expect(SubProcess).toHaveRun(`sqlcmd -Q "DROP DATABASE database-test-${i + 1};"  -U david -P <filtered> -S localhost -P 3306`)
    }
  })
})
