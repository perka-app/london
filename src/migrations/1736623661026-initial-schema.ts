import { randomUUID } from 'crypto';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1736623661026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp extension
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

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
        name: 'message',
        columns: [
          {
            name: 'messageId',
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
        name: 'subscriber',
        columns: [
          {
            name: 'subscriberId',
            type: 'uuid',
            isPrimary: true,
            isGenerated: false,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'organisationId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'confirmed',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'joinedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
    );

    // Insert initial dummy organisation
    const organisationId = randomUUID();
    await queryRunner.query(
      `INSERT INTO organisation ("organisationId", "name", "login", "email", "password", "description", "avatarUrl") VALUES ('${organisationId}', 'Dummy Organisation', 'dummy_org', 'dummy@organisation.com', 'dummy_password', 'This is a dummy organisation.', 'https://perka-api-bucket.s3.eu-north-1.amazonaws.com/file1737753403855')`,
    );

    // Insert initial dummy messages
    for (let i = 1; i <= 5; i++) {
      await queryRunner.query(
        `INSERT INTO message ("messageId", "organisationId", "subject", "text", "sentAt", "reciversCount") VALUES ('${randomUUID()}', '${organisationId}', 'This is dummy title ${i}', 'This is dummy message ${i}', NOW(), 10)`,
      );
    }

    // Insert 50 subscribers
    const subscribers = [];
    for (let i = 0; i < 100; i++) {
      const subscriberId = randomUUID();
      const email = `subscriber${i}@example.com`;
      const confirmed = i < 90;
      const joinedAt = new Date(
        Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000),
      ).toISOString();

      subscribers.push(
        `('${subscriberId}', '${organisationId}', '${email}', ${confirmed}, '${joinedAt}')`,
      );
    }

    await queryRunner.query(
      `INSERT INTO "subscriber" ("subscriberId", "organisationId", "email", "confirmed", "joinedAt") VALUES ${subscribers.join(
        ', ',
      )}`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscriber', true);
    await queryRunner.dropTable('message', true);
    await queryRunner.dropTable('organisation', true);
  }
}
