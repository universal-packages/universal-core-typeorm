import CoreInitializer from '@universal-packages/core/CoreInitializer'

export default class TypeormInitializer extends CoreInitializer {
  public static readonly initializerName = 'typeorm'
  public static readonly description: string = 'Core TypeORM initializer'

  public readonly templatesLocation: string = `${__dirname}/templates`
}
