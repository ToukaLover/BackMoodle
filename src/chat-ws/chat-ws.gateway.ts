import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({cors:true})
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  constructor(private readonly chatWsService: ChatWsService) {}

  handleDisconnect(client: Socket) {
    console.log("Cliente desconectado",client.id)
  }

  handleConnection(client: Socket) {
    console.log("Cliente conectado",client.id)
  }
  
}
