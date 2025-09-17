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
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('notes')
export class NotesController {
  constructor(private notes: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req: any) {
    return this.notes.list(req.user?.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.notes.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: { title: string; content: string }) {
    return this.notes.create({ ...dto, userId: req.user?.sub });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() patch: any) {
    return this.notes.update(id, patch);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notes.remove(id);
  }
}
