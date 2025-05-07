import { WebSocketGateway } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';

@WebSocketGateway({cors:true})
export class ChatWsGateway {
  constructor(private readonly chatWsService: ChatWsService) {}

  



  
}
