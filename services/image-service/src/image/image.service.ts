import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { POLL_BUCKET_NAME } from 'src/common/constants';
import Logger from '@pollify/logger';

@Injectable()
export class ImageService implements OnModuleInit {
  constructor(@Inject(MINIO_CONNECTION) private readonly minioClient: Client) {}

  onModuleInit() {
    const bucketNames = [POLL_BUCKET_NAME];

    bucketNames.forEach(async (bucketName) => {
      Logger.info(`Setting up bucket with name: ${bucketName}`);

      if (await this.minioClient.bucketExists(bucketName)) return;

      await this.minioClient.makeBucket(bucketName, 'eu-west-1');

      await this.minioClient.setBucketPolicy(
        bucketName,
        JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:GetObject'],
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Resource: [`arn:aws:s3:::${bucketName}/public/*`],
            },
          ],
        }),
      );

      Logger.info(`Newly created bucket with name: ${bucketName}`);
    });
  }

  async uploadImage(
    bucketName: string,
    imageName: string,
    image: Buffer,
    isPublic: boolean = true,
  ) {
    return this.minioClient.putObject(
      bucketName,
      `${isPublic ? 'public' : 'private'}/${imageName}`,
      image,
      {
        'Content-Type': 'image/png',
      },
    );
  }

  async removeImage(
    bucketName: string,
    imageName: string,
    isPublic: boolean = true,
  ) {
    await this.minioClient.removeObject(
      bucketName,
      `${isPublic ? 'public' : 'private'}/${imageName}`,
    );
  }
}
