import { MigrationInterface, QueryRunner } from 'typeorm'

export class SomeMigration1660864294044 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
