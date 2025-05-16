import { Controller, Get, Post, Body, Param, Delete, Put, Res, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService, private readonly authService: AuthService) { }

    @Get('admins')
    async findAdmins(){
        return this.usuarioService.findAdmins()
    }

    @Post('create')
    create(@Body() body: { username: string; password: string; role: string }) {
        return this.usuarioService.create(body);
    }

    @Get('all')
    findAll() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usuarioService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: {password: string}) {
        return this.usuarioService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usuarioService.remove(id);
    }

    @Post('auth')
    async getAuth(@Body() data: { pass: string, user: { username: string; password: string; role: string } }, @Res() res) {
        try {
            const result = await this.usuarioService.getAuth(data.pass, data.user.password);
            const token = await this.authService.signIn(data.user.username, data.user.role)
            if (result) {
                return res.status(HttpStatus.OK).json({ success: true, token });
            } else {
                return res.status(HttpStatus.OK).json({ success: false });
            }
        } catch (error) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Error al verificar la autenticación' });
        }
    }

    @Post('auth/verify')
    async getAuthVer(@Body() data, @Res() res) {
        try {
            const result = await this.authService.verify(data.token);
            if (result) {
                return res.status(HttpStatus.OK).json(result);
            }
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ mensaje: "Token no valido" });
        }
    }

    @Get('name/:username')
    findByUsename(@Param('username') username: string) {
        return this.usuarioService.findByUsename(username);
    }

    @Get(':id/proyectos')
    async getProyectos(@Param('id') id: string) {
        return this.usuarioService.getProyectosDeUsuario(id); // Llamamos al servicio para obtener los proyectos
    }

    @Get('project/:id')
  findByUserId(@Param('id') id: string) {
    return this.usuarioService.findByProjectId(id);
  }

}
