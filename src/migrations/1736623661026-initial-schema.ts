import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1736623661026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create client table if it doesn't exist
    const clientTableExists = await queryRunner.hasTable('client');
    if (!clientTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'client',
          columns: [
            {
              name: 'clientId',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
          ],
        }),
      );
    }

    // Create organisation table if it doesn't exist
    const organisationTableExists = await queryRunner.hasTable('organisation');
    if (!organisationTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'organisation',
          columns: [
            {
              name: 'organisationId',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'login',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'varchar',
              length: '150',
              isNullable: true,
            },
            {
              name: 'avatarUrl',
              type: 'varchar',
              isNullable: true,
            },
          ],
        }),
      );
    }

    // Create email table if it doesn't exist
    const emailTableExists = await queryRunner.hasTable('email');
    if (!emailTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'email',
          columns: [
            {
              name: 'emailId',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'organisationId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'subject',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'text',
              type: 'text',
              isNullable: false,
            },
            {
              name: 'sentAt',
              type: 'timestamp',
              isNullable: false,
            },
            {
              name: 'reciversCount',
              type: 'int',
              isNullable: false,
            },
          ],
        }),
      );
    }

    // Create membership table if it doesn't exist
    const membershipTableExists = await queryRunner.hasTable('membership');
    if (!membershipTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'membership',
          columns: [
            {
              name: 'membershipId',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
              default: 'uuid_generate_v4()',
            },
            {
              name: 'clientId',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'organisationId',
              type: 'uuid',
              isNullable: false,
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('membership', true);
    await queryRunner.dropTable('email', true);
    await queryRunner.dropTable('organisation', true);
    await queryRunner.dropTable('client', true);
  }
}
