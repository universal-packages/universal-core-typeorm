import { populateTemplates } from '@universal-packages/template-populator'

import TypeormTask from '../../src/Typeorm.universal-core-task'

jest.mock('typeorm')
jest.mock('@universal-packages/template-populator')

const coreConfigOverride = {
  config: { location: './tests/__fixtures__/config' },
  modules: { location: './tests/__fixtures__' },
  tasks: { location: './tests/__fixtures__' },
  environments: { location: './tests/__fixtures__' }
}

describe(TypeormTask, (): void => {
  it('init', async (): Promise<void> => {
    await jestCore.execTask('typeorm-task', { directive: 'init', args: { f: true }, coreConfigOverride })
    expect(populateTemplates).toHaveBeenCalledWith(expect.stringMatching(/universal-core-typeorm\/src\/template/), './src', { override: true })
  })

  it('throws an error if directive is not recognized', async (): Promise<void> => {
    await expect(jestCore.execTask('typeorm-task', { directive: 'nop', args: { f: true }, coreConfigOverride })).rejects.toThrow('Unrecognized Typeorm command')
  })
})
