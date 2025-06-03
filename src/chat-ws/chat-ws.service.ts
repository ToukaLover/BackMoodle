import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Usuario } from 'src/usuario/usuario.schema';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from '../auth/auth.service';
//Creamos una lista que tiene sockets y usuarios.
interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: Usuario | null
    }
}

@Injectable()
export class ChatWsService {

    constructor(private readonly usuarioService: UsuarioService, private readonly authService: AuthService) { }

    private connectedClients: ConnectedClients = {}

    //Funcion que mete a un usuario a la lista
    async registerClient(client: Socket, tokenData) {
        if (tokenData) {
            //recibimos el token y buscamos por username al ser unico
            const user = await this.usuarioService.findByUsename(tokenData.username)
            
            this.connectedClients[client.id] = { socket: client, user }
            // console.log(this.getConnectedClients())
        }
    }
    //Quitamos al cliente de la lista
    removeClient(id: string) {
        delete this.connectedClients[id]
    }
    //Devolvemos todos los usuarios
    getConnectedClients() {
        return Object.entries(this.connectedClients).map(([id, { user }]) => ({
            socketId: id,
            username: user?.username ?? null
        }));
    }
    //Devolvemos todos los usuarios menos el Id recibido
    getOtherClients(excludeSocketId?: string) {
        return Object.entries(this.connectedClients)
            .filter(([id]) => id !== excludeSocketId)
            .map(([id, { user }]) => ({
                socketId: id,
                username: user?.username ?? null,
                imgLink: user?.imgLink ?? null
            }));
    }
    //Devuelve el socketId y username del socket especificado
    getClientUser(socketId: string) {
        return { socketId: this.connectedClients[socketId].socket.id, user: this.connectedClients[socketId].user?.username }
    }

}  
