import { Logger } from '@universal-packages/logger'

import { TypeormModule } from '../../src'

jest.mock('typeorm')

jestCore.runBare({
  coreConfigOverride: {
    config: { location: './tests/__fixtures__/not-config' },
    modules: { location: './tests/__fixtures__' },
    environments: { location: './tests/__fixtures__' }
  }
})

describe(TypeormModule, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    expect(global.typeormSubject).toBeUndefined()
    expect(core.coreModules.typeormModule.config).toEqual({})

    expect(Logger).toHaveLogged({ level: 'WARNING', title: 'Typeorm configuration pending' })
  })
})
