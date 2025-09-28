import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { VideoEntity } from "./video.entity";

@Entity("frames")
export class FrameEntity {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ type: "uuid", name: "video_id" })
  videoId: string;

  @Column({ type: "int", name: "frame_number" })
  frameNumber: number;

  @Column({ type: "varchar", length: 255 })
  filename: string;

  @Column({ type: "varchar", length: 500 })
  path: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => VideoEntity, (video) => video.frames)
  @JoinColumn({ name: "video_id", referencedColumnName: "id" })
  video: VideoEntity;
}
