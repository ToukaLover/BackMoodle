import { Module } from '@nestjs/common';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { Proyecto, ProyectoSchema } from './proyecto.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/usuario/usuario.schema';
import { RecursoService } from 'src/recurso/recurso.service';
import { Recurso, RecursoSchema } from 'src/recurso/recurso.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }]),
            MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
            MongooseModule.forFeature([{ name: Recurso.name, schema: RecursoSchema }])],
  controllers: [ProyectoController],
  providers: [ProyectoService,RecursoService]
})
export class ProyectoModule {}
