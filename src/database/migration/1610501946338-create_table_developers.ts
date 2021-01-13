import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableDevelopers1610501946338 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'developers',
        columns: [
          {
            name: 'id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'name',
            type: 'varchar'
          },
          {
            name: 'gender',
            type: 'char'
          },
          {
            name: 'age',
            type: 'integer'
          },
          {
            name: 'hobby',
            type: 'varchar'
          },
          {
            name: 'birth',
            type: 'date'
          }
        ]
      })
    )
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('developers')
  }
}
