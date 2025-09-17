import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  participants?: string;

  @Column({ nullable: true })
  place?: string;

  @Column({ nullable: true })
  supplies?: string;

  @Column({ nullable: true })
  remarks?: string;

  @Column()
  start!: string; // ISO local string

  @Column()
  end!: string; // ISO local string

  @ManyToOne(() => User, (u) => u.events, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User | null;
}
