import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../user/user.entity";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  tokenHash: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ default: false })
  revoked: boolean;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @Column({ nullable: true, type: "varchar" })
  deviceInfo: string | null;

  @Column({ nullable: true, type: "varchar" })
  ipAddress: string | null;

  @CreateDateColumn()
  createdAt: Date;
}