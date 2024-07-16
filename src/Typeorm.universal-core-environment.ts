import { CoreEnvironment } from '@universal-packages/core'

export default class TypeormEnvironment extends CoreEnvironment {
  public static readonly onlyFor = 'tasks'
  public static readonly tideTo = 'typeorm'

  public beforeModulesLoad(): void {
    global['CORE_TYPE_ORM_TASK'] = true
  }
}
