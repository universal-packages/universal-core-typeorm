import { DataSourceOptions } from 'typeorm'

export interface TypeormModuleConfig {
  dataSource: DataSourceOptions
  entitiesDir: string
  migrationsDir: string
  subscribersDir: string
}
