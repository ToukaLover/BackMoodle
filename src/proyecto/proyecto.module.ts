import { Module } from '@nestjs/common';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { Proyecto, ProyectoSchema } from './proyecto.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/usuario/usuario.schema';
import { RecursoService } from 'src/recurso/recurso.service';
import { Recurso, RecursoSchema } from 'src/recurso/recurso.schema';
import { MinioService } from 'src/minio/minio.service';
import { Foro, ForoSchema } from 'src/foro/foro.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }]),
            MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
            MongooseModule.forFeature([{ name: Foro.name, schema: ForoSchema }]),
            MongooseModule.forFeature([{ name: Recurso.name, schema: RecursoSchema }])],
  controllers: [ProyectoController],
  providers: [ProyectoService,RecursoService,MinioService]
})
export class ProyectoModule {}
