import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatWsService } from './chat-ws.service';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: true })

//Implementamos las clases OnGatewayConnection y OnGatewayDisconnect que manejan la conexion y desconexion.
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  //Server para poder mandar cosas a los demas clientes / Siempre es asi y es de socket.io
  @WebSocketServer() wss: Server

  constructor(private readonly chatWsService: ChatWsService,
    private readonly authService: AuthService
  ) { }


  //Cuando se conecta un usuario, cogemos el token del header de la peticion, lo verificamos (No hace falta, siempre será correcto) y tenemos el nombre y rol  
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string

    const tokenData = await this.authService.verify(token)

    this.chatWsService.registerClient(client, tokenData)
  }


  //Cuando se desconecta, quitamos al cliente de la lista
  handleDisconnect(client: Socket) {
    this.chatWsService.removeClient(client.id)
  }

  //SuscribeMessage escucha mensajes
  // on escucha, emit envia, to es a varios o a quien quieras por Id emit/on ('nombre-evento', (funcion/Que envia))
  @SubscribeMessage('message-from-user') //El cliente me lo da el propio SubscribeMessage
  handleMessageFromUser(client: Socket, payload: any) {
    // Envía el mensaje al cliente que lo envía
    client.emit('message-to', {message:payload.message,from: this.chatWsService.getClientUser(payload.from)});

    // Envía el mensaje al usuario al que se le dirige el mensaje (payload.to)
    this.wss.to(payload.to).emit('message-to', {message:payload.message,from: this.chatWsService.getClientUser(payload.from)});
  }

  //Si el servidor escucha el mensaje "getUsers"
  @SubscribeMessage('getUsers')
  giveUsers(client: Socket) {

    //El server emite "giveUsers" y manda con esto una lista con todos los sockets menos él proprio cliente que mandó "getUsers"

    this.wss.emit('giveUsers', this.chatWsService.getOtherClients(client.id))
  }

  //Si el chat es cancelado (cuando se cancela el cliente emite "chat-cancelado") el servidor manda al cliente especificado "chat-cancel"
  @SubscribeMessage('chat-cancelado')
  chatCancel(client: Socket,to) {
    this.wss.to(to).emit('chat-cancel')
  }

  //Si el chat esta ocupado (el cliente emite esto) el servidor manda al cliente especificado "Usuario-Ocupado"
  @SubscribeMessage('chat-ocupado')
  chatOcupado(client: Socket,to) {
    this.wss.to(to).emit('Usuario-Ocupado')
  }

}
