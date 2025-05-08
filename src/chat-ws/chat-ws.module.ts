import { Module } from '@nestjs/common';
import { ChatWsService } from './chat-ws.service';
import { ChatWsGateway } from './chat-ws.gateway';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [ChatWsGateway, ChatWsService,AuthService],
})
export class ChatWsModule {}
