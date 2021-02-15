import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { generateId } from "../helpers/generateId";
import { File } from "./File";
import { Invite } from "./Invite";

export enum Permission {
  ADMINISTRATOR = 1,
  CREATE_INVITE = 1 << 1,
  DELETE_USERS = 1 << 2,
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  @Index()
  username!: string;

  @Column({ default: 0 })
  permissions!: number;

  @Column({ select: false })
  @Exclude()
  password!: string;

  @Column()
  @Exclude()
  token!: string;

  @OneToMany(() => File, (file) => file.owner)
  files!: File[];

  @OneToOne(() => Invite, { nullable: false, onDelete: "CASCADE" })
  invite!: Invite;

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.token) this.token = generateId(64);
  }

  public checkPermissions(permission: Permission | number) {
    return (this.permissions & permission) === permission;
  }

  public addPermissions(permission: Permission | number) {
    this.permissions |= permission;
  }

  public clearPermissions(permission: Permission | number) {
    this.permissions &= ~permission;
  }
}
