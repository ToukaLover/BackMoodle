import { Controller, Post, Get, Body, Param, Delete, Put, UploadedFile, UseInterceptors, Res, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RecursoService } from './recurso.service';
import { Recurso } from './recurso.schema';
import { privateDecrypt } from 'crypto';
import { MinioService } from 'src/minio/minio.service';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';

@ApiTags('Recursos')
@Controller('recursos')
export class RecursoController {
    constructor(private readonly recursoService: RecursoService, private readonly minioService: MinioService) { }

    @Post('link')
    @ApiBody({ type: Recurso })
    @ApiOkResponse({ description: 'Recurso link creado', type: Recurso })
    uploadLink(@Body() body: { link: string; title: string; visible: boolean; projectId: string }) {
        return this.recursoService.uploadLink(body);
    }

    @Post('tarealink')
    @ApiBody({ type: Recurso })
    @ApiOkResponse({ description: 'Recurso tarea link creado', type: Recurso })
    uploadTareaLink(@Body() body: { link: string; title: string; userId: string; tareaId: string }) {
        return this.recursoService.uploadTareaLink(body);
    }

    @Post('file')
    //Recibe un fichero
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
    }))
    @ApiOkResponse({ description: 'Archivo subido', type: Recurso })
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
        const objectName = uuidv4() + '-' + body.title + "." + this.getExtension(file.mimetype);
        const recursoMongo = await this.recursoService.uploadFile(objectName, body.visible, body.projectId, body.title)
        const minio = await this.minioService.upload(file, objectName);
        if (!minio) {
            await this.recursoService.deleteFile(recursoMongo.id)
            return { message: "Subida Fallida" }
        }
        return { message: "Subida Completada" }

    }

    @Post('tareafile')
    //Recibe un fichero
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
    }))
    @ApiOkResponse({ description: 'Archivo de tarea subido', type: Recurso })
    async uploadTareaFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
        const objectName = uuidv4() + '-' + body.title + "." + this.getExtension(file.mimetype);
        const recursoMongo = await this.recursoService.uploadTareaFile(body, objectName);
        const minio = await this.minioService.upload(file, objectName);
        if (!minio) {
            await this.recursoService.deleteFile(recursoMongo.id)
            return { message: "Subida Fallida" }
        }
        return { message: "Subida Completada" }
    }

    @Post('img')
    //Recibe un fichero
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            },
        }),
    }))
    @ApiOkResponse({ description: 'Imagen subida', type: Recurso })
    async uploadImg(@UploadedFile() file: Express.Multer.File, @Body('projectId') projectId: string) {
        const objectName = uuidv4() + '-' + file.originalname;
        const recursoMongo = await this.recursoService.uploadImg(projectId, objectName);
        const minio = await this.minioService.upload(file, objectName);
        if (!minio) {
            await this.recursoService.deleteFile(recursoMongo.id)
            return { message: "Subida Fallida" }
        }
        return { message: "Subida Completada" }
    }

    @Get('proyecto/:projectId')
    @ApiOkResponse({ description: 'Recursos del proyecto', type: [Recurso] })
    getRecursosByProject(@Param('projectId') projectId: string) {
        return this.recursoService.getAllResourcesByProject(projectId);
    }

    @Get('tarea/:tareaId/user/:userId')
    @ApiOkResponse({ description: 'Verifica si el usuario tiene recursos en la tarea' })
    async getRecursosByTareaUser(@Res() res: Response, @Param('tareaId') tareaId: string, @Param('userId') userId: string) {
        const recursoUSer = await this.recursoService.findTareaByUserAndTarea(tareaId, userId);
        res.send({ success: !!recursoUSer });
    }

    @Get('tarea/:tareaId')
    @ApiOkResponse({ description: 'Recursos de una tarea', type: [Recurso] })
    getRecursosByTarea(@Param('tareaId') tareaId: string) {
        return this.recursoService.findTareaRecursos(tareaId);
    }

    @Get('file/:id')
    @ApiOkResponse({ description: 'Archivo descargado' })
    async getFile(@Param('id') id: string, @Res() res: Response) {
        //Recibo el id del fichero (guardado en la base de datos)
        const recurso = await this.recursoService.getFile(id);
        await this.minioService.getObject(res, recurso?.metadata.objectName, recurso?.metadata.title)
    }

    @Delete('file/:id')
    @ApiOkResponse({ description: 'Archivo descargado' })
    async deleteFile(@Param('id') id: string) {
        return await this.recursoService.deleteFile(id)
    }

    @Get('img/proyecto/:projectId')
    @ApiOkResponse({ description: 'Imagen del proyecto' })
    async getImgByProject(@Param('projectId') projectId: string, @Res() res: Response) {
        //Busca un img por su projectId
        const recurso = await this.recursoService.getImg(projectId);
        if (recurso !== null) {
            return await this.minioService.getObject(res, recurso?.metadata.objectName)
        } else {
            res.send({ success: false })
        }
    }

    @Put(':id')
    @ApiBody({ type: Recurso })
    @ApiOkResponse({ description: 'Recurso actualizado', type: Recurso })
    updateRecurso(@Param('id') id: string, @Body() body: { visible?: boolean; title?: string }) {
        return this.recursoService.updateRecurso(id, body);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Recurso eliminado' })
    deleteRecursoByProject(@Param('id') id: string) {
        return this.recursoService.deleteRecursosByProject(id);
    }

    @Delete('delAny/:id')
    @ApiOkResponse({ description: 'Recurso eliminado completamente' })
    deleteRecurso(@Param('id') id: string) {
        return this.recursoService.remove(id);
    }

    @Delete('tarea/:tareaId/user/:userId')
    @ApiOkResponse({ description: 'Recurso de tarea eliminado' })
    deleteRecursoTarea(@Param('tareaId') tareaId: string, @Param('userId') userId: string) {
        return this.recursoService.deleteTareaRecursouser(tareaId, userId);
    }

    //Con esta funcion recojo el mimetype de un fichero, para poder añadirle una extension automaticamente a la hora de devolver un fichero
    //Estos no son todas las extensiones existentes, son las mas usadas
    private getExtension(mimetype: string): string {
        const map: Record<string, string> = {
            'application/pdf': 'pdf',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'text/plain': 'txt',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/zip': 'zip',
            'application/x-zip-compressed': 'zip',
            'application/vnd.rar': 'rar',
            'application/x-rar-compressed': 'rar',
        };
        return map[mimetype] || 'bin';
    }
}
