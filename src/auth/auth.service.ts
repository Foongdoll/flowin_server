import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.users.create(email, name, hash);
    const token = await this.sign(user);
    return { token, user: this.publicUser(user) };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user)
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    const token = await this.sign(user);
    return { token, user: this.publicUser(user) };
  }

  async me(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    return this.publicUser(user);
  }

  private async sign(user: User) {
    return await this.jwt.signAsync({ sub: user.id, email: user.email });
  }

  private publicUser(user: User) {
    const { id, email, name, createdAt, updatedAt } = user;
    return { id, email, name, createdAt, updatedAt };
  }
}
