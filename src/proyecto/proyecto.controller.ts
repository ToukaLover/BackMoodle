// proyecto.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { Usuario } from 'src/usuario/usuario.schema';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) { }

  @Post('create')
  create(@Body() body: { title: string; description: string; admin_id: string }) {
    return this.proyectoService.create(body);
  }

  @Get('all')
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: string) {
    return this.proyectoService.findByUserId(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<{ title: string; description: string; admin_id: string }>) {
    return this.proyectoService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(id);
  }

  @Get(':id/usuarios')
  getUsuariosDelProyecto(@Param('id') id: string) {
    return this.proyectoService.findProyectoWithUsuarios(id);
  }

  @Post(':proyectoId/usuarios/:usuarioId')
  addUserToProyecto(@Param('proyectoId') proyectoId: string, @Param('usuarioId') usuarioId: string) {
    return this.proyectoService.addUserToProyecto(proyectoId, usuarioId);  // Agregar un usuario al proyecto
  }


  @Delete(':proyectoId/usuarios/:usuarioId')
  deleteUserFromProyecto(@Param('proyectoId') proyectoId: string, @Param('usuarioId') usuarioId: string) {
    return this.proyectoService.deleteUserFromProyecto(proyectoId, usuarioId);  // Elimina un usuario al proyecto
  }

}
