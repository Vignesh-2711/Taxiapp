import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

export type RideStatus = "pending" | "accepted" | "completed" | "cancelled";

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column({ type: "varchar" })
  status: RideStatus;

  @ManyToOne(() => User, { nullable: true })
  passenger: User;

  @ManyToOne(() => User, { nullable: true })
  driver: User;

  @Column({ type: "float", nullable: true })
  fare: number;
}