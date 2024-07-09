import { SubProcess } from '@universal-packages/sub-process'
import os from 'os'

import TypeormTask from '../../src/Typeorm.universal-core-task'

jest.mock('typeorm')
jest.mock('@universal-packages/template-populator')

const coreConfigOverride = {
  config: { location: './tests/__fixtures__/config-postgres' },
  modules: { location: './tests/__fixtures__' },
  tasks: { location: './tests/__fixtures__' },
  environments: { location: './tests/__fixtures__' }
}

process.env['SELF_TEST'] = 'true'

describe(TypeormTask, (): void => {
  it('db:create', async (): Promise<void> => {
    await coreJest.execTask('typeorm', { directive: 'db:create', coreConfigOverride })

    expect(SubProcess).toHaveRun('createdb postgres -U david -h localhost -p 5432')

    const cpuCount = os.cpus().length

    for (let i = 0; i < cpuCount; i++) {
      expect(SubProcess).toHaveRun(`createdb postgres-test-${i + 1} -U david -h localhost -p 5432`)
    }
  })

  it('db:drop', async (): Promise<void> => {
    await coreJest.execTask('typeorm', { directive: 'db:drop', coreConfigOverride })

    expect(SubProcess).toHaveRun('dropdb postgres -U david -h localhost -p 5432')

    const cpuCount = os.cpus().length

    for (let i = 0; i < cpuCount; i++) {
      expect(SubProcess).toHaveRun(`dropdb postgres-test-${i + 1} -U david -h localhost -p 5432`)
    }
  })
})
