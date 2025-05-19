import { Controller,Get,Post,Body,Param,Delete,Put,Res,HttpStatus,} from '@nestjs/common';
import {ApiOkResponse,ApiResponse,ApiTags,ApiExcludeEndpoint,} from '@nestjs/swagger';
import { UsuarioService } from './usuario.service';
import { AuthService } from 'src/auth/auth.service';
import { Usuario } from './usuario.schema'; // Asegúrate de tener este schema

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly authService: AuthService,
    ) { }

    @Get('admins')
    @ApiOkResponse({ description: 'Lista de usuarios administradores', type: [Usuario] })
    findAdmins() {
        return this.usuarioService.findAdmins();
    }

    @ApiExcludeEndpoint()
    @Post('create')
    create(@Body() body: { username: string; password: string; role: string }) {
        return this.usuarioService.create(body);
    }

    @Get('all')
    @ApiOkResponse({ description: 'Lista de todos los usuarios', type: [Usuario] })
    findAll() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Usuario por ID', type: Usuario })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    findOne(@Param('id') id: string) {
        return this.usuarioService.findOne(id);
    }

    @Put(':id')
    @ApiOkResponse({ description: 'Usuario actualizado', type: Usuario })
    update(@Param('id') id: string, @Body() body: { password: string }) {
        return this.usuarioService.update(id, body);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Usuario eliminado' })
    remove(@Param('id') id: string) {
        return this.usuarioService.remove(id);
    }

    @ApiExcludeEndpoint()
    @Post('auth')
    async getAuth(
        @Body()
        data: {
            pass: string;
            user: { username: string; password: string; role: string };
        },
        @Res() res,
    ) {
        try {
            const result = await this.usuarioService.getAuth(
                data.pass,
                data.user.password,
            );
            const token = await this.authService.signIn(
                data.user.username,
                data.user.role,
            );
            if (result) {
                return res.status(HttpStatus.OK).json({ success: true, token });
            } else {
                return res.status(HttpStatus.OK).json({ success: false });
            }
        } catch (error) {
            return res
                .status(HttpStatus.FORBIDDEN)
                .json({ message: 'Error al verificar la autenticación' });
        }
    }

    @Post('auth/verify')
    @ApiOkResponse({ description: 'Verificación de token JWT' })
    @ApiResponse({ status: 500, description: 'Token no válido' })
    async getAuthVer(@Body() data, @Res() res) {
        try {
            const result = await this.authService.verify(data.token);
            if (result) {
                return res.status(HttpStatus.OK).json(result);
            }
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ mensaje: 'Token no valido' });
        }
    }

    @Get('name/:username')
    @ApiOkResponse({ description: 'Usuario por nombre de usuario', type: Usuario })
    findByUsename(@Param('username') username: string) {
        return this.usuarioService.findByUsename(username);
    }

    @Get(':id/proyectos')
    @ApiOkResponse({ description: 'Proyectos asociados al usuario' })
    getProyectos(@Param('id') id: string) {
        return this.usuarioService.getProyectosDeUsuario(id);
    }

    @Get('project/:id')
    @ApiOkResponse({ description: 'Usuarios relacionados a un proyecto', type: [Usuario] })
    findByUserId(@Param('id') id: string) {
        return this.usuarioService.findByProjectId(id);
    }
}
