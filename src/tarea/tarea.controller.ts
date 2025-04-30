import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TareaService } from './tarea.service';
import { Tarea } from './tarea.schema';

@Controller('tareas')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  create(@Body() data: Partial<Tarea>) {
    return this.tareaService.create(data);
  }

  @Get()
  findAll() {
    return this.tareaService.findAll();
  }

  @Get('proyecto/:projectId')
  findByProject(@Param('projectId') projectId: string) {
    return this.tareaService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<Tarea>) {
    return this.tareaService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tareaService.delete(id);
  }
}
