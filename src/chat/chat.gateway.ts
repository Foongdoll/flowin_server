import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type ChatMsg =
  | { id: string; from: 'me' | 'friend'; type: 'text'; text: string; at: number }
  | { id: string; from: 'me' | 'friend'; type: 'image' | 'video'; uri: string; at: number };

@WebSocketGateway({ namespace: '/chat', cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server!: Server;

  private rooms: Map<string, ChatMsg[]> = new Map();

  handleConnection(client: Socket) {
    // no-op, client should emit 'join' with room id
  }

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.join(room);
    const history = this.rooms.get(room) ?? [];
    client.emit('history', history);
    return { ok: true };
  }

  @SubscribeMessage('message')
  message(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string; msg: Omit<ChatMsg, 'id' | 'at'> },
  ) {
    const full: ChatMsg = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, at: Date.now(), ...(data.msg as any) };
    const list = this.rooms.get(data.room) ?? [];
    list.push(full);
    this.rooms.set(data.room, list.slice(-200)); // cap
    this.server.to(data.room).emit('message', full);
    return { ok: true };
  }

  getHistory(room: string) {
    return this.rooms.get(room) ?? [];
  }
}
