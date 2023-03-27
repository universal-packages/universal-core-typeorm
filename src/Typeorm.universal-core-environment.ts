import { CoreEnvironment } from '@universal-packages/core'

export default class TypeormEnvironment extends CoreEnvironment {
  public static readonly onlyFor = 'tasks'
  public static readonly tideTo = 'typeorm-task'

  public beforeModulesLoad(): void {
    global['TYPE_ORM_TASK'] = true
  }
}
