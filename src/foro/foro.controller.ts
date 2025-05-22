import { Controller, Get, Post, Body, Param, Delete, Put, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ForoService } from './foro.service';
import { Foro } from './foro.schema';

@ApiTags('Foro')
@Controller('foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente', type: Foro })
  @ApiResponse({ status: 400, description: 'Error en la creación de la publicación' })
  create(@Body() foro: Foro) {
    return this.foroService.create(foro);
  }

  @Get()
  @ApiOkResponse({ description: 'Listado de publicaciones', type: [Foro] })
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.foroService.findAll(pageNum, limitNum);
  }

  @Get('proyecto/:proyectoId')
  @ApiOkResponse({ description: 'Listado de publicaciones filtradas por proyectoId', type: [Foro] })
  @ApiParam({ name: 'proyectoId', description: 'ID del proyecto' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: '1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite por página', example: '10' })
  findByProyectoId(
    @Param('proyectoId') proyectoId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    if (!proyectoId) {
      throw new BadRequestException('proyectoId is required');
    }

    return this.foroService.findByProyectoId(proyectoId, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Publicación encontrada por ID', type: Foro })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.foroService.findOne(id);
  }

  @Get('respuestas/:idPadre')
  @ApiOkResponse({ description: 'Respuestas a una publicación', type: [Foro] })
  getRespuestas(@Param('idPadre') idPadre: string): Promise<Foro[]> {
    return this.foroService.findByParentId(idPadre);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Publicación actualizada', type: Foro })
  update(@Param('id') id: string, @Body() foro: Foro) {
    return this.foroService.update(id, foro);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Publicación eliminada' })
  remove(@Param('id') id: string) {
    return this.foroService.remove(id);
  }
}
