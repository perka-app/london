import {
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private logger = new Logger(S3Service.name);
  private region: string;
  private s3: S3Client;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('S3_REGION') || 'eu-north-1';
    const accessKeyId =
      this.configService.get<string>('AWS_ACCESS_KEY_ID') || '';
    const secretAccessKey =
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '';

    this.s3 = new S3Client({
      region: this.region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const bucket = this.configService.get<string>('S3_BUCKET_NAME');
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      } else {
        throw Error('Image not saved to S3 bucket.');
      }
    } catch (err) {
      this.logger.error('Cannot save file to S3', err);
      throw err;
    }
  }
}
