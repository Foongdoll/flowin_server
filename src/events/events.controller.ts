import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('events')
export class EventsController {
  constructor(private events: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    const userId = req.user?.sub as string | undefined;
    return this.events.list(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.events.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: any) {
    const userId = req.user?.sub as string | undefined;
    return this.events.create({ ...dto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() patch: any) {
    return this.events.update(id, patch);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.events.remove(id);
  }
}
