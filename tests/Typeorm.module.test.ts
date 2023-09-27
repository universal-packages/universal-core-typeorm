import { Logger } from '@universal-packages/logger'
import { DataSource } from 'typeorm'

import { TypeormModule } from '../src'

jest.mock('typeorm')

describe(TypeormModule, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    const module = new TypeormModule({} as any, new Logger())

    await module.prepare()

    expect(DataSource).toHaveBeenCalled()

    await module.release()

    expect(DataSource).toHaveBeenCalled()
  })
})
