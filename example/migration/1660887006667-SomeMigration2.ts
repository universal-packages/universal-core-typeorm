import { MigrationInterface, QueryRunner } from 'typeorm'

export class SomeMigration21660887006667 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
