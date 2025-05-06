import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Delete,
    Put,
    UploadedFile,
    UseInterceptors,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { RecursoService } from './recurso.service';
import { FileInterceptor } from '@nestjs/platform-express';
import e, { Response } from 'express';

@Controller('recursos')
export class RecursoController {
    constructor(private readonly recursoService: RecursoService) { }

    // Crear recurso tipo Link
    @Post('link')
    async uploadLink(
        @Body() body: { link: string; title: string; visible: boolean; projectId: string },
    ) {
        return this.recursoService.uploadLink(body);
    }

    // Crear recurso tipo tareaLink
    @Post('tarealink')
    async uploadTareaLink(
        @Body() body: { link: string; title: string; userId: string, tareaId: string },
    ) {
        return this.recursoService.uploadTareaLink(body);
    }

    // Crear recurso tipo File
    @Post('file')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body,
    ) {
        return this.recursoService.uploadFile(body, file);
    }

    // Crear recurso tipo tareaFile
    @Post('tareafile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadTareaFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body,
    ) {
        return this.recursoService.uploadTareaFile(body, file);
    }



    // Crear recurso tipo Imagen
    @Post('img')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImg(
        @UploadedFile() file: Express.Multer.File,
        @Body('projectId') projectId: string
    ) {
        return this.recursoService.uploadImg(file, projectId);
    }

    // Obtener todos los recursos de un proyecto (excepto imágenes)
    @Get('proyecto/:projectId')
    async getRecursosByProject(@Param('projectId') projectId: string) {
        return this.recursoService.getAllResourcesByProject(projectId);
    }

    // Para saber si el usuario tiene algun recurso subido a la tarea 
    @Get('tarea/:tareaId/user/:userId')
    async getRecursosByTareaUser(@Res() res, @Param('tareaId') tareaId: string, @Param('userId') userId: string) {
        const recursoUSer = await this.recursoService.findTareaByUserAndTarea(tareaId, userId);

        if (recursoUSer) {
            res.send({ success: true })
        } else {
            res.send({ success: false })
        }

    }

    // Para saber si el usuario tiene algun recurso subido a la tarea 
    @Get('tarea/:tareaId')
    async getRecursosByTarea(@Param('tareaId') tareaId: string) {
        return this.recursoService.findTareaRecursos(tareaId);
    }

    @Get('file/:id')
    async getFile(@Param('id') id: string, @Res() res: Response) {
        const recurso = await this.recursoService.getFile(id);

        const mimetype = recurso?.metadata.mimetype;
        const extension = this.getExtension(mimetype);
        const title = recurso?.metadata.title?.replace(/\s+/g, '_') || 'archivo';
        const filename = `${title}.${extension}`;

        res.set({
            'Content-Type': mimetype,
            'Content-Disposition': `attachment; filename="${filename}"`,
        });

        res.send(recurso?.metadata.data);
    }


    // Obtener imagen de un proyecto
    @Get('img/proyecto/:projectId')
    async getImgByProject(@Param('projectId') projectId: string, @Res() res: Response) {
        const recurso = await this.recursoService.getImg(projectId);

        if (recurso) {
            res.set({
                'Content-Type': recurso?.metadata.mimetype,
            });

            // Enviar el archivo directamente sin modificación
            res.send(recurso?.metadata.data);
        } else {
            res.send({ success: false })
        }
    }

    // Obtener imagen de un proyecto
    @Get('img/default')
    async getDefaultImg(@Res() res: Response) {
        const recurso = await this.recursoService.getDefaultImg("6811d6f71e07ef33a6bcfdca");

        if (recurso) {
            res.set({
                'Content-Type': recurso?.metadata.mimetype,
            });

            // Enviar el archivo directamente sin modificación
            res.send(recurso?.metadata.data);
        } else {
            res.send({ success: false })
        }
    }


    // Actualizar recurso tipo Link o File (usamos Partial)
    @Put(':id')
    async updateRecurso(
        @Param('id') id: string,
        @Body() body: { visible?: boolean; title?: string },
    ) {
        return this.recursoService.updateRecurso(id, body);
    }

    // Eliminar recurso por ID (cualquiera)
    @Delete(':id')
    async deleteRecursoByProject(@Param('id') id: string) {
        return this.recursoService.deleteRecursosByProject(id);
    }

    // Para eliminar el recurso subido a la tarea 
    @Delete('tarea/:tareaId/user/:userId')
    async deleteRecursoTarea(@Param('tareaId') tareaId: string, @Param('userId') userId: string) {
        return this.recursoService.deleteTareaRecursouser(tareaId, userId);
    }

    getExtension(mimetype: string): string {
        const map: Record<string, string> = {
            'application/pdf': 'pdf',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'text/plain': 'txt',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            // Agrega más según tu necesidad
        };

        return map[mimetype] || 'bin'; // default a 'bin' si no está definido
    }


}
