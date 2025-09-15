import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, name: string, passwordHash: string) {
    const exist = await this.findByEmail(email);
    if (exist) throw new BadRequestException('이미 등록된 이메일입니다.');
    const user = this.repo.create({ email, name, passwordHash });
    return this.repo.save(user);
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }
}
