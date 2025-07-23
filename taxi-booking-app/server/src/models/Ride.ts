import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

export type RideStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: RideStatus;

  @ManyToOne(() => User, { nullable: false })
  passenger: User;

  @ManyToOne(() => User, { nullable: true })
  driver: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}