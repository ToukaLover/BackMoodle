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
        @Body() body: { link: string; title: string; userId: string,tareaId:string },
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
        return this.recursoService.uploadFile(body,file);
    }

    // Crear recurso tipo tareaFile
    @Post('tareafile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadTareaFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body,
    ) {
        return this.recursoService.uploadTareaFile(body,file);
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
    // Obtener todos los recursos de un proyecto (excepto imágenes)
    @Get('tarea/:tareaId/user/:userId')
    async getRecursosByTareaUser(@Param('tareaId') tareaId: string,@Param('userId') userId: string) {
        return this.recursoService.findTareaByUserAndTarea(tareaId,userId);
    }

    // Obtener recurso File por ID
    @Get('file/:id')
    async getFile(@Param('id') id: string, @Res() res: Response) {
        const recurso = await this.recursoService.getFile(id);

        res.set({
            'Content-Type': recurso?.metadata.mimetype,
        });
 
        // Enviar el archivo directamente sin modificación
        res.send(recurso?.metadata.data);
    }

    // Obtener imagen de un proyecto
    @Get('img/proyecto/:projectId')
    async getImgByProject(@Param('projectId') projectId: string, @Res() res: Response) {
        const recurso = await this.recursoService.getImg(projectId);

        if(recurso){
            res.set({
                'Content-Type': recurso?.metadata.mimetype,
            });
    
            // Enviar el archivo directamente sin modificación
            res.send(recurso?.metadata.data);
        }else{
            res.send({success:false})
        }
    }

    // Obtener imagen de un proyecto
    @Get('img/default')
    async getDefaultImg(@Res() res: Response) {
        const recurso = await this.recursoService.getDefaultImg("6811d6f71e07ef33a6bcfdca");

        if(recurso){
            res.set({
                'Content-Type': recurso?.metadata.mimetype,
            });
    
            // Enviar el archivo directamente sin modificación
            res.send(recurso?.metadata.data);
        }else{
            res.send({success:false})
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
}
