import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { FrameEntity } from "./frame.entity";

@Entity("videos")
export class VideoEntity {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "varchar", length: 255 })
  filename: string;

  @Column({ type: "uuid", name: "user_email" })
  userEmail: string;

  @Column({ type: "varchar", length: 255, name: "original_name" })
  originalName: string;

  @Column({ type: "bigint" })
  size: number;

  @Column({ type: "varchar", length: 50 })
  status: string;

  @Column({ type: "int", default: 0, name: "frame_count" })
  frameCount: number;

  @Column({ type: "uuid", name: "user_id" })
  userId: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => FrameEntity, (frame) => frame.video)
  @JoinColumn({ name: "id", referencedColumnName: "videoId" })
  frames: FrameEntity[];
}
