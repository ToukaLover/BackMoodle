import { Controller, Post, Get, Body, Param, Delete, Put, UploadedFile, UseInterceptors, Res, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RecursoService } from './recurso.service';
import { Recurso } from './recurso.schema';

@ApiTags('Recursos')
@Controller('recursos')
export class RecursoController {
    constructor(private readonly recursoService: RecursoService) {}

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
    @UseInterceptors(FileInterceptor('file'))
    @ApiOkResponse({ description: 'Archivo subido', type: Recurso })
    uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
        return this.recursoService.uploadFile(body, file);
    }

    @Post('tareafile')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOkResponse({ description: 'Archivo de tarea subido', type: Recurso })
    uploadTareaFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
        return this.recursoService.uploadTareaFile(body, file);
    }

    @Post('img')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOkResponse({ description: 'Imagen subida', type: Recurso })
    uploadImg(@UploadedFile() file: Express.Multer.File, @Body('projectId') projectId: string) {
        return this.recursoService.uploadImg(file, projectId);
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

    @Get('img/proyecto/:projectId')
    @ApiOkResponse({ description: 'Imagen del proyecto' })
    async getImgByProject(@Param('projectId') projectId: string, @Res() res: Response) {
        const recurso = await this.recursoService.getImg(projectId);
        if (recurso) {
            res.set({ 'Content-Type': recurso?.metadata.mimetype });
            res.send(recurso?.metadata.data);
        } else {
            res.send({ success: false });
        }
    }

    @Get('img/default')
    @ApiOkResponse({ description: 'Imagen por defecto' })
    async getDefaultImg(@Res() res: Response) {
        const recurso = await this.recursoService.getDefaultImg("6825b9083a9defef9471f2b0");
        if (recurso) {
            res.set({ 'Content-Type': recurso?.metadata.mimetype });
            res.send(recurso?.metadata.data);
        } else {
            res.send({ success: false });
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
