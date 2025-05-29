import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';


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

        const fileStream = fs.createReadStream(file.path);

        await new Promise((resolve, reject) => {
            try {
                this.minioClient.putObject(
                    bucketName,
                    objectName,
                    fileStream,
                    file.size,
                    (err, etag) => {
                        if (err) {
                            reject(new InternalServerErrorException('Error uploading to MinIO'));
                        }
                        resolve(etag);
                    },
                );

            } catch (error) {
                console.error(error)
            }
        });

        await fsPromises.unlink(file.path);

        return {
            bucket: bucketName,
            objectName,
            url: `http://localhost:9000/${bucketName}/${objectName}`,
        };

    }

    async getObject(res: Response, objectName: string, title?: string): Promise<void> {
        const bucketName = 'innoroom';

        try {
            const stream = await this.minioClient.getObject(bucketName, objectName);

            const filename = title + "." + objectName.split(".")[1]

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/octet-stream');

            stream.pipe(res);
        } catch (error) {
            console.error(error);
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
