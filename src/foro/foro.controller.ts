import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ForoService } from './foro.service';
import { Foro } from './foro.schema';

@Controller('foro')
export class ForoController {
    constructor(private readonly foroService: ForoService) { }

    @Post()
    create(@Body() foro: Foro) {
        return this.foroService.create(foro);
    }

    @Get()
    findAll(@Query('page') page: string, @Query('limit') limit: string) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        return this.foroService.findAll(pageNum, limitNum);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.foroService.findOne(id);
    }

    @Get('respuestas/:idPadre')
    async getRespuestas(@Param('idPadre') idPadre: string): Promise<Foro[]> {
        return this.foroService.findByParentId(idPadre);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() foro: Foro) {
        return this.foroService.update(id, foro);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.foroService.remove(id);
    }
}
