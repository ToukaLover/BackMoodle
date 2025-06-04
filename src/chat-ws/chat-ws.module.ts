import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ProyectoModule } from 'src/proyecto/proyecto.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/usuario/usuario.schema';
import { Proyecto, ProyectoSchema } from 'src/proyecto/proyecto.schema';
import { Foro, ForoSchema } from 'src/foro/foro.schema';

@Module({
  providers: [ChatWsGateway, ChatWsService,AuthService,UsuarioService],
  imports:[
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    MongooseModule.forFeature([{ name: Foro.name, schema: ForoSchema }]),
    MongooseModule.forFeature([{ name: Proyecto.name, schema: ProyectoSchema }]),
    
  ]
})
export class ChatWsModule {}
