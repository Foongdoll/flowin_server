import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly repo: Repository<Post>,
    private readonly users: UsersService,
  ) {}

  list(q?: string, category?: string) {
    const where: any = {};
    if (q) where.title = () => `title LIKE '%${q.replace(/'/g, "''")}%'`;
    if (category && category !== '전체') where.category = category;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async get(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: { title: string; content: string; category: string; userId?: string; authorName?: string }) {
    const post = this.repo.create({
      title: data.title,
      content: data.content,
      category: data.category,
      authorName: data.authorName,
    });
    if (data.userId) {
      const user = await this.users.findById(data.userId);
      if (user) post.user = user;
    }
    return this.repo.save(post);
  }

  async update(id: string, patch: Partial<Post>) {
    await this.repo.update({ id }, patch);
    return this.get(id);
  }

  async remove(id: string) {
    await this.repo.delete({ id });
    return { ok: true };
  }
}

