import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friendship } from '../entities/friendship.entity';
import { UsersService } from '../users/users.service';

export type FriendSummary = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friendship) private readonly repo: Repository<Friendship>,
    private readonly users: UsersService,
  ) {}

  private toSummary(entity: Friendship): FriendSummary {
    return {
      id: entity.friend.id,
      email: entity.friend.email,
      name: entity.friend.name,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  async list(userId: string): Promise<FriendSummary[]> {
    const rows = await this.repo.find({
      where: { user: { id: userId } },
      relations: { friend: true },
      order: { createdAt: 'DESC' },
    });
    return rows.map((row) => this.toSummary(row));
  }

  async get(userId: string, friendId: string): Promise<FriendSummary> {
    const relation = await this.repo.findOne({
      where: { user: { id: userId }, friend: { id: friendId } },
      relations: { friend: true },
    });
    if (!relation) throw new NotFoundException('친구를 찾을 수 없습니다.');
    return this.toSummary(relation);
  }

  async add(userId: string, email: string): Promise<FriendSummary> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) throw new BadRequestException('이메일을 입력하세요.');
    const target = await this.users.findByEmail(normalized);
    if (!target)
      throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');
    if (target.id === userId)
      throw new BadRequestException('자기 자신은 친구로 추가할 수 없습니다.');

    const exists = await this.repo.findOne({
      where: { user: { id: userId }, friend: { id: target.id } },
    });
    if (exists) throw new BadRequestException('이미 친구로 등록되어 있습니다.');

    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');

    const forward = this.repo.create({ user, friend: target });
    const inverse = this.repo.create({ user: target, friend: user });
    await this.repo.save([forward, inverse]);
    return this.get(userId, target.id);
  }

  async remove(userId: string, friendId: string): Promise<{ ok: true }> {
    await this.repo.delete({ user: { id: userId }, friend: { id: friendId } });
    await this.repo.delete({ user: { id: friendId }, friend: { id: userId } });
    return { ok: true };
  }
}
