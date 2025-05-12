import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: true })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  //Server para poder mandar cosas a los demas clientes / Siempre es asi y es de socket.io
  @WebSocketServer() wss : Server
  
  constructor(private readonly chatWsService: ChatWsService,
      private readonly authService : AuthService
  ) { }


  //Cuando se conecta un usuario, cogemos el token del header de la peticion, lo verificamos (No hace falta, siempre será correcto) y tenemos el nombre y rol  
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string

    const tokenData = await this.authService.verify(token)


    
    this.chatWsService.registerClient(client,tokenData)
  }

  handleDisconnect(client: Socket) {
    this.chatWsService.removeClient(client.id)
  }

  //SuscribeMessage escucha mensajes
  // on escucha, emit envia, to es a varios o a quien quieras por Id emit/on ('nombre-evento', (funcion/Que envia))
  @SubscribeMessage('message-from-user') //El cliente me lo da el propio SubscribeMessage
  handleMessageFromUser(client : Socket, payload : any){
    this.wss.to(payload.to).emit('message-to',payload.message)
  }
  
  @SubscribeMessage('getUsers')
  giveUsers(client:Socket){
    this.wss.emit('giveUsers',this.chatWsService.getConnectedClients())
  }

}
