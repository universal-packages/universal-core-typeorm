import { TypeormModule } from '../src'

jest.mock('typeorm')

jestCore.runBare({
  coreConfigOverride: {
    config: { location: './tests/__fixtures__/config' },
    modules: { location: './tests/__fixtures__' },
    environments: { location: './tests/__fixtures__' },
    logger: { silence: true }
  }
})

describe(TypeormModule, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    expect(global.typeormSubject).not.toBeUndefined()

    expect(core.coreModules.typeormModule.config).toEqual({
      dataSource: {
        type: '<type>',
        entities: ['./src/entity/*.ts'],
        migrations: ['./src/migration/*.ts'],
        synchronize: true,
        logging: false
      },
      entitiesDir: './src/entity',
      migrationsDir: './src/migration',
      subscribersDir: './src/subscriber'
    })
  })
})
