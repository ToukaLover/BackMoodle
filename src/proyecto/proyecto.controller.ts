// proyecto.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, Res } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Proyecto } from './proyecto.schema';

@ApiTags('Proyectos') // Para agrupar en Swagger UI
@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) { }

  @Post('create')
  @ApiResponse({ status: 201, description: 'Proyecto creado', type: Proyecto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() body: { title: string; description: string; admin_id: string }, @Res() res) {

    const proyecto = await this.proyectoService.create(body)

    if (proyecto === false) {
      return res.status(201).json({ error: 'Proyecto con ese titulo ya existe' });
    }

     return res.status(201).json(proyecto);
  }

  @Get('all')
  @ApiOkResponse({ description: "Lista de proyectos", type: [Proyecto] })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: "Proyecto por ID", type: Proyecto })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findOne(@Param('id') id: string) {
    return this.proyectoService.findOne(id);
  }

  @Get('title/:title')
  @ApiOkResponse({ description: "Buscar proyecto por título" })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  findOneByTitle(@Param('title') title: string, @Res() res) {
    this.proyectoService.findOneByTitle(title).then((proyecto) => {
      if (proyecto) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });
  }

  @Get('user/:id')
  @ApiOkResponse({ description: "Proyectos por ID de usuario", type: [Proyecto] })
  findByUserId(@Param('id') id: string) {
    return this.proyectoService.findByUserId(id);
  }

  @Put(':id')
  @ApiOkResponse({ description: "Proyecto actualizado", type: Proyecto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; description: string; admin_id: string }>
  ) {
    return this.proyectoService.update(id, body);
  }

  @Delete(':id')
  @ApiOkResponse({ description: "Proyecto eliminado" })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  remove(@Param('id') id: string) {
    return this.proyectoService.remove(id);
  }

  @Get(':id/usuarios')
  @ApiOkResponse({ description: "Usuarios de un proyecto" })
  @ApiResponse({ status: 404, description: 'Proyecto no encontrado' })
  getUsuariosDelProyecto(@Param('id') id: string) {
    return this.proyectoService.findProyectoWithUsuarios(id);
  }

  @Post(':proyectoId/usuarios/:usuarioId')
  @ApiOkResponse({ description: "Usuario agregado al proyecto" })
  @ApiResponse({ status: 404, description: 'Proyecto o Usuario no encontrado' })
  addUserToProyecto(@Param('proyectoId') proyectoId: string, @Param('usuarioId') usuarioId: string) {
    return this.proyectoService.addUserToProyecto(proyectoId, usuarioId);
  }

  @Delete(':proyectoId/usuarios/:usuarioId')
  @ApiOkResponse({ description: "Usuario eliminado del proyecto" })
  @ApiResponse({ status: 404, description: 'Proyecto o Usuario no encontrado' })
  deleteUserFromProyecto(@Param('proyectoId') proyectoId: string, @Param('usuarioId') usuarioId: string) {
    return this.proyectoService.deleteUserFromProyecto(proyectoId, usuarioId);
  }
}
