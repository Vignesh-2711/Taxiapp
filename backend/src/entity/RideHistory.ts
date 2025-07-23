import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Ride } from "./Ride";

@Entity()
export class RideHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Ride)
  ride: Ride;

  @CreateDateColumn()
  timestamp: Date;
}