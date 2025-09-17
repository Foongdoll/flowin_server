import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { Note } from './note.entity';
import { CalendarEvent } from './calendar-event.entity';
import { Document } from './document.entity';
import { Friendship } from './friendship.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  passwordHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Post, (p) => p.user)
  posts!: Post[];

  @OneToMany(() => Note, (n) => n.user)
  notes!: Note[];

  @OneToMany(() => CalendarEvent, (e) => e.user)
  events!: CalendarEvent[];

  @OneToMany(() => Document, (d) => d.user)
  documents!: Document[];

  @OneToMany(() => Friendship, (f) => f.user)
  friendships!: Friendship[];

  @OneToMany(() => Friendship, (f) => f.friend)
  friendedBy!: Friendship[];
}
