import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly repo: Repository<Note>,
    private readonly users: UsersService,
  ) {}

  list(userId?: string) {
    const where: any = {};
    if (userId) where.user = { id: userId } as any;
    return this.repo.find({ where, order: { updatedAt: 'DESC' } });
  }

  get(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: { title: string; content: string; userId?: string }) {
    const note = this.repo.create({ title: data.title, content: data.content });
    if (data.userId) {
      const user = await this.users.findById(data.userId);
      if (user) note.user = user;
    }
    return this.repo.save(note);
  }

  async update(id: string, patch: Partial<Note>) {
    await this.repo.update({ id }, patch);
    return this.get(id);
  }

  async remove(id: string) {
    await this.repo.delete({ id });
    return { ok: true };
  }
}
