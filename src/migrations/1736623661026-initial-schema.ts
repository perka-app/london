import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1736623661026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

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
          {
            name: 'joinedAt',
            type: 'timestamp',
            isNullable: false,
          },
        ],
      }),
    );

    // Insert initial dummy organisation
    const organisationId = randomUUID();
    await queryRunner.query(
      `INSERT INTO organisation ("organisationId", "name", "login", "email", "password", "description", "avatarUrl") VALUES ('${organisationId}', 'Dummy Organisation', 'dummy_org', 'dummy@organisation.com', 'dummy_password', 'This is a dummy organisation.', 'http://example.com/avatar.png')`,
    );

    // Insert initial dummy clients and memberships
    for (let i = 1; i <= 10; i++) {
      const clientId = randomUUID();
      await queryRunner.query(
        `INSERT INTO client ("clientId", "name", "email") VALUES ('${clientId}', 'Dummy Client ${i}', 'dummy${i}@client.com')`,
      );
      await queryRunner.query(
        `INSERT INTO membership ("membershipId", "clientId", "organisationId", "joinedAt") VALUES ('${randomUUID()}', '${clientId}', '${organisationId}', NOW())`,
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
