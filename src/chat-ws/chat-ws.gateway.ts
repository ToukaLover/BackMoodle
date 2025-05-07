import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatWsService: ChatWsService) { }


  handleConnection(client: Socket) {
    this.chatWsService.registerClient(client)
    console.log({ conectados: this.chatWsService.getConnectedClients() })

  }

  handleDisconnect(client: Socket) {
    this.chatWsService.removeClient(client.id)
  }

}
