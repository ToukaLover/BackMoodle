import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService {
    private minioClient: Minio.Client;

    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: 'admin',
            secretKey: 'admin123',
        });
    }

    async upload(file: Express.Multer.File, objectName: string): Promise<any> {
        const bucketName = 'innoroom';

        // Verificar si el bucket existe
        const exists = await this.minioClient.bucketExists(bucketName).catch(() => false);
        if (!exists) {
            await this.minioClient.makeBucket(bucketName, 'us-east-1');
        }  

        return new Promise((resolve, reject) => {
            this.minioClient.putObject(
                bucketName,
                objectName,
                file.buffer,
                file.size,
                (err, etag) => {
                    if (err) {
                        reject(new InternalServerErrorException('Error uploading to MinIO'));
                    } else {
                        resolve({
                            bucket: bucketName,
                            key: objectName,
                            etag,
                            url: `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`,
                        });
                    }
                },
            );
        });
    }

    async getObject(res: Response, objectName: string, title?: string): Promise<void> {
        const bucketName = 'innoroom';

        try {
            const stream = await this.minioClient.getObject(bucketName, objectName);

            const filename = title + "." + objectName.split(".")[1]

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');

            stream.pipe(res);
        } catch {

        }
    }

    async delete(objectName: string): Promise<void> {
        const bucketName = 'innoroom';

        try {
            await this.minioClient.removeObject(bucketName, objectName);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el archivo de MinIO');
        }
    }

}
