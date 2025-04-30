import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario, UsuarioSchema } from './usuario.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Proyecto, ProyectoSchema } from 'src/proyecto/proyecto.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
            MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }])],
  providers: [UsuarioService,AuthService],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
