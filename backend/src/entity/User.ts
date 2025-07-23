import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export type UserRole = "driver" | "passenger";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "varchar" })
  role: UserRole;
}