import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly repo: Repository<CalendarEvent>,
    private readonly users: UsersService,
  ) {}

  list(userId?: string) {
    const where: any = {};
    if (userId) where.user = { id: userId } as any;
    return this.repo.find({ where });
  }

  get(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Omit<CalendarEvent, 'id'> & { userId?: string }) {
    const e = this.repo.create({ ...data });
    if (data.userId) {
      const user = await this.users.findById(data.userId);
      if (user) e.user = user;
    }
    // Remove userId if present
    // @ts-expect-error – transient prop
    delete e.userId;
    return this.repo.save(e);
  }

  async update(id: string, patch: Partial<CalendarEvent>) {
    await this.repo.update({ id }, patch);
    return this.get(id);
  }

  async remove(id: string) {
    await this.repo.delete({ id });
    return { ok: true };
  }
}
