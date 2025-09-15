import { Body, Controller, Delete, Get, Param, Post as HttpPost, Put, Query, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService) {}

  @Get()
  list(@Query('q') q?: string, @Query('category') category?: string) {
    return this.posts.list(q, category);
  }

  @Get('categories')
  categories() {
    return ['전체', '공지', '질문', '팁', '모집', '자유', '버그'];
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.posts.get(id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpPost()
  create(@Req() req: any, @Body() dto: { title: string; content: string; category: string; authorName?: string }) {
    const userId = req.user?.sub as string | undefined;
    return this.posts.create({ ...dto, userId, authorName: dto.authorName });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() patch: any) {
    return this.posts.update(id, patch);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posts.remove(id);
  }
}

