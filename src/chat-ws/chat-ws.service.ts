import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Usuario } from 'src/usuario/usuario.schema';
import { UsuarioService } from '../usuario/usuario.service';

interface ConnectedClients{
    [id:string]:{
        socket:Socket,
        user:Usuario | null
    }
}

@Injectable()
export class ChatWsService {

    constructor(private readonly usuarioService:UsuarioService){}

    private connectedClients : ConnectedClients = {}

    async registerClient(client:Socket,tokenData){

        const user = await this.usuarioService.findByUsename(tokenData.username) 

        this.connectedClients[client.id] = {socket:client,user}
    }
    removeClient(id:string){
        delete this.connectedClients[id]
    }

    getConnectedClients():string[]{
        return Object.keys(this.connectedClients)
    }

    getClientUser(socketId:string){
        return this.connectedClients[socketId]
    }

}  
