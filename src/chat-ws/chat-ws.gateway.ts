import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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



  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string

    this.chatWsService.registerClient(client)

    const tokenData = await this.authService.verify(token)

    console.log(tokenData)
  }

  handleDisconnect(client: Socket) {
    this.chatWsService.removeClient(client.id)
  }

  //SuscribeMessage escucha mensajes
  // on escucha, emit envia, to es a varios o a quien quieras por Id emit/on ('nombre-evento', (funcion/Que envia))
  @SubscribeMessage('message-from-user') //El cliente me lo da el propio SubscribeMessage
  handleMessageFromUser(client : Socket, payload : any){



  }


}
