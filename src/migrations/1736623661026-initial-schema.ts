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
            name: 'receiversCount',
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

    // Insert initial dummy messages
    const messages = [
      {
        subject: 'Birthday Party Offer',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Birthday Party Offer</h1></div><div class="content"><p class="offer">Get 20% off on your next birthday party booking!</p><div class="details"><table><tr><th>Offer Details</th><th>Validity</th></tr><tr><td>20% off on all birthday party bookings</td><td>Valid till 31st December</td></tr></table></div><img src="https://example.com/birthday-party.jpg" alt="Birthday Party" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Taco Day Special',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Taco Day Special</h1></div><div class="content"><p class="offer">Celebrate Taco Day with a 50% discount on all tacos!</p><div class="details"><table><tr><th>Offer Details</th><th>Validity</th></tr><tr><td>50% off on all tacos</td><td>Valid on Taco Day only</td></tr></table></div><img src="https://example.com/taco-day.jpg" alt="Taco Day" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Summer BBQ Bash',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Summer BBQ Bash</h1></div><div class="content"><p class="offer">Join us for a summer BBQ bash with live music and great food!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Live music, BBQ, and fun activities</td><td>25th June, 5 PM onwards</td></tr></table></div><img src="https://example.com/summer-bbq.jpg" alt="Summer BBQ" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Halloween Spooktacular',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Halloween Spooktacular</h1></div><div class="content"><p class="offer">Get ready for a spooky Halloween night with our special event!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Costume contest, haunted house, and more</td><td>31st October, 7 PM onwards</td></tr></table></div><img src="https://example.com/halloween.jpg" alt="Halloween" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Christmas Extravaganza',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Christmas Extravaganza</h1></div><div class="content"><p class="offer">Celebrate Christmas with us and enjoy a festive evening!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Christmas carols, dinner, and gifts</td><td>25th December, 6 PM onwards</td></tr></table></div><img src="https://example.com/christmas.jpg" alt="Christmas" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: "New Year's Eve Gala",
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>New Year\'s Eve Gala</h1></div><div class="content"><p class="offer">Ring in the New Year with our grand gala event!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Live band, dinner, and fireworks</td><td>31st December, 8 PM onwards</td></tr></table></div><img src="https://example.com/new-year.jpg" alt="New Year" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: "Valentine's Day Special",
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Valentine\'s Day Special</h1></div><div class="content"><p class="offer">Celebrate love with our Valentine\'s Day special event!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Romantic dinner, live music, and gifts</td><td>14th February, 7 PM onwards</td></tr></table></div><img src="https://example.com/valentine.jpg" alt="Valentine\'s Day" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Easter Egg Hunt',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Easter Egg Hunt</h1></div><div class="content"><p class="offer">Join us for a fun-filled Easter egg hunt event!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Easter egg hunt, games, and prizes</td><td>4th April, 10 AM onwards</td></tr></table></div><img src="https://example.com/easter.jpg" alt="Easter" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Independence Day Celebration',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Independence Day Celebration</h1></div><div class="content"><p class="offer">Celebrate Independence Day with us!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Parade, fireworks, and BBQ</td><td>4th July, 6 PM onwards</td></tr></table></div><img src="https://example.com/independence-day.jpg" alt="Independence Day" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
      {
        subject: 'Thanksgiving Feast',
        text: `<html><head><style>body { font-family: Arial, sans-serif; } .container { width: 100%; } .header { background-color: #f8f9fa; padding: 20px; text-align: center; } .content { padding: 20px; } .footer { background-color: #f8f9fa; padding: 10px; text-align: center; } .offer { color: #ff6347; font-size: 24px; font-weight: bold; } .details { margin-top: 20px; } .details table { width: 100%; border-collapse: collapse; } .details th, .details td { border: 1px solid #ddd; padding: 8px; text-align: left; } .details th { background-color: #f2f2f2; } </style></head><body><div class="container"><div class="header"><h1>Thanksgiving Feast</h1></div><div class="content"><p class="offer">Join us for a grand Thanksgiving feast!</p><div class="details"><table><tr><th>Event Details</th><th>Date & Time</th></tr><tr><td>Traditional Thanksgiving dinner</td><td>25th November, 5 PM onwards</td></tr></table></div><img src="https://example.com/thanksgiving.jpg" alt="Thanksgiving" style="width:100%; margin-top:20px;"></div><div class="footer"><p>Contact us at <a href="mailto:info@example.com">info@example.com</a></p></div></div></body></html>`,
      },
    ];

    const messageValues = messages.map((message) => {
      const messageId = randomUUID();
      const sentAt = new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
      ).toISOString();
      const receiversCount = Math.floor(Math.random() * 100) + 1; // Random receiversCount between 1 and 100
      return `('${messageId}', '${organisationId}', '${message.subject.replace(/'/g, "''")}', '${message.text.replace(/'/g, "''")}', '${sentAt}', ${receiversCount})`;
    });

    await queryRunner.query(
      `INSERT INTO message ("messageId", "organisationId", "subject", "text", "sentAt", "receiversCount") VALUES ${messageValues.join(', ')}`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subscriber', true);
    await queryRunner.dropTable('message', true);
    await queryRunner.dropTable('organisation', true);
  }
}
