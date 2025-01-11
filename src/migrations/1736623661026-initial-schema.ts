import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1736623661026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Create clients table if it doesn't exist
    const clientsTableExists = await queryRunner.hasTable('clients');
    if (!clientsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'clients',
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

    // Create organisations table if it doesn't exist
    const organisationsTableExists = await queryRunner.hasTable(
      'organisations',
    );
    if (!organisationsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'organisations',
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

    // Create emails table if it doesn't exist
    const emailsTableExists = await queryRunner.hasTable('emails');
    if (!emailsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'emails',
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

    // Create memberships table if it doesn't exist
    const membershipsTableExists = await queryRunner.hasTable('memberships');
    if (!membershipsTableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'memberships',
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
    await queryRunner.dropTable('memberships', true);
    await queryRunner.dropTable('emails', true);
    await queryRunner.dropTable('organisations', true);
    await queryRunner.dropTable('clients', true);
  }
}
