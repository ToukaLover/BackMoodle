import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { Link, LinkSchema } from './recurso/links.schema';
import { RecursoService } from './recurso/recurso.service';
import { RecursoController } from './recurso/recurso.controller';
import { RecursoModule } from './recurso/recurso.module';
import { Img, ImgSchema } from './recurso/img.schema';
import { File, FileSchema } from './recurso/files.schema';
import { Recurso, RecursoSchema } from './recurso/recurso.schema';
import { ProyectoController } from './proyecto/proyecto.controller';
import { ProyectoModule } from './proyecto/proyecto.module';
import { Proyecto, ProyectoSchema } from './proyecto/proyecto.schema';
import { ProyectoService } from './proyecto/proyecto.service';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario, UsuarioSchema } from './usuario/usuario.schema';
import { UsuarioService } from './usuario/usuario.service';
import { TareaModule } from './tarea/tarea.module';
import { Tarea, TareaSchema } from './tarea/tarea.schema';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    }),
    MongooseModule.forRoot('mongodb://localhost/tu-db', {
      connectionFactory: (connection) => {
        return connection;
      },
    }),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
    MongooseModule.forFeature([{ name: Img.name, schema: ImgSchema }]),
    MongooseModule.forFeature([{ name: Recurso.name, schema: RecursoSchema }]),
    MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }]),
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    MongooseModule.forFeature([{ name: Tarea.name, schema: TareaSchema }]),
    RecursoModule,
    ProyectoModule,
    UsuarioModule,
    TareaModule,
  ],
  controllers: [
   AuthController, RecursoController, ProyectoController],
  providers: [
    AuthService, RecursoService, ProyectoService,UsuarioService],
})
export class AppModule { }
