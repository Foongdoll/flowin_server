import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'friend'])
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.friendships, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => User, (user) => user.friendedBy, { onDelete: 'CASCADE' })
  friend!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
