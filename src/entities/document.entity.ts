import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  originalName!: string;

  @Column()
  mime!: string;

  @Column('int')
  size!: number;

  @Column()
  path!: string; // relative path under uploads

  @CreateDateColumn()
  uploadedAt!: Date;

  @ManyToOne(() => User, (u) => u.documents, { nullable: true, onDelete: 'SET NULL' })
  user?: User | null;
}

