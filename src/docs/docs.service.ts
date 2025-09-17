import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class DocsService {
  constructor(
    @InjectRepository(Document) private readonly repo: Repository<Document>,
    private readonly users: UsersService,
  ) {}

  list(userId?: string) {
    const where: any = {};
    if (userId) where.user = { id: userId } as any;
    return this.repo.find({ where, order: { uploadedAt: 'DESC' } });
  }

  get(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: {
    title: string;
    originalName: string;
    mime: string;
    size: number;
    path: string;
    userId?: string;
  }) {
    const doc = this.repo.create(data);
    if (data.userId) {
      const user = await this.users.findById(data.userId);
      if (user) doc.user = user;
    }
    return this.repo.save(doc);
  }

  async remove(id: string) {
    await this.repo.delete({ id });
    return { ok: true };
  }
}
