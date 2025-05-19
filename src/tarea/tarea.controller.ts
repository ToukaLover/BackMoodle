import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { TareaService } from './tarea.service';
import { Tarea } from './tarea.schema';

@ApiTags('Tareas')
@Controller('tareas')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  @ApiBody({ type: Tarea })
  @ApiOkResponse({ description: 'Tarea creada', type: Tarea })
  create(@Body() data: Partial<Tarea>) {
    return this.tareaService.create(data);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de todas las tareas', type: [Tarea] })
  findAll() {
    return this.tareaService.findAll();
  }

  @Get('proyecto/:projectId')
  @ApiOkResponse({ description: 'Tareas por proyecto', type: [Tarea] })
  findByProject(@Param('projectId') projectId: string) {
    return this.tareaService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Obtener tarea por ID', type: Tarea })
  findOne(@Param('id') id: string) {
    return this.tareaService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: Tarea })
  @ApiOkResponse({ description: 'Tarea actualizada', type: Tarea })
  update(@Param('id') id: string, @Body() data: Partial<Tarea>) {
    return this.tareaService.update(id, data);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Tarea eliminada' })
  delete(@Param('id') id: string) {
    return this.tareaService.delete(id);
  }
}
