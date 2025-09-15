import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column({ default: '자유' })
  category!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (u) => u.posts, { nullable: true, onDelete: 'SET NULL' })
  user?: User | null;

  @Column({ type: 'text', nullable: true })
  authorName?: string | null;
}
