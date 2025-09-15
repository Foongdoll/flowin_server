import { Controller, Get, Query } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(private gateway: ChatGateway) {}

  @Get('history')
  history(@Query('room') room: string) {
    return this.gateway.getHistory(room);
  }
}
