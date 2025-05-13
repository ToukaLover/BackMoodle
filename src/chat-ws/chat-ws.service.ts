import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Usuario } from 'src/usuario/usuario.schema';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from '../auth/auth.service';

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

    async registerClient(client: Socket, tokenData) {
        if (tokenData) {
            const user = await this.usuarioService.findByUsename(tokenData.username)
            
            this.connectedClients[client.id] = { socket: client, user }
            console.log(this.getConnectedClients())
        }
    }
    removeClient(id: string) {
        delete this.connectedClients[id]
    }

    getConnectedClients() {
        return Object.entries(this.connectedClients).map(([id, { user }]) => ({
            socketId: id,
            username: user?.username ?? null
        }));
    }

    getOtherClients(excludeSocketId?: string) {
        return Object.entries(this.connectedClients)
            .filter(([id]) => id !== excludeSocketId)
            .map(([id, { user }]) => ({
                socketId: id,
                username: user?.username ?? null
            }));
    }

    getClientUser(socketId: string) {
        return { socketId: this.connectedClients[socketId].socket.id, user: this.connectedClients[socketId].user?.username }
    }

}  
