import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friends: FriendsService) {}

  private getUserId(req: Request & { user?: { sub?: string } }) {
    return req.user?.sub as string;
  }

  @Get()
  list(@Req() req: Request & { user?: { sub?: string } }) {
    const userId = this.getUserId(req);
    return this.friends.list(userId);
  }

  @Post()
  add(
    @Req() req: Request & { user?: { sub?: string } },
    @Body('email') email: string,
  ) {
    const userId = this.getUserId(req);
    return this.friends.add(userId, email);
  }

  @Get(':friendId')
  get(@Req() req: Request & { user?: { sub?: string } }, @Param('friendId') friendId: string) {
    const userId = this.getUserId(req);
    return this.friends.get(userId, friendId);
  }

  @Delete(':friendId')
  remove(@Req() req: Request & { user?: { sub?: string } }, @Param('friendId') friendId: string) {
    const userId = this.getUserId(req);
    return this.friends.remove(userId, friendId);
  }
}
