import { Entity, IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { IsBoolean, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { config } from "../../config";
import { generateContentId } from "../../helpers/generate-content-id.helper";
import { User } from "../user/user.entity";

@Entity({ tableName: "pastes" })
export class Paste {
  @PrimaryKey({ type: String })
  id = generateContentId();

  @Property({ type: "varchar", length: 500000 })
  content: string;

  @Property({ nullable: true })
  extension?: string;

  @Property()
  encrypted: boolean;

  @Property()
  burn: boolean;

  @Property({ nullable: true, type: Date })
  expiresAt?: Date;

  @Property({ type: Date })
  createdAt = new Date();

  @ManyToOne(() => User, {
    hidden: true,
    nullable: true,
    wrappedReference: true,
  })
  owner?: IdentifiedReference<User>;

  @Property({ persist: false })
  get urls() {
    return {
      view: config.rootHost.url + this.paths.view,
      direct: config.rootHost.url + this.paths.direct,
      metadata: config.rootHost.url + this.paths.metadata,
    };
  }

  @Property({ persist: false })
  get paths() {
    const viewUrl = `/p/${this.id}`;
    const directUrl = `/p/${this.id}${this.extension}`;
    const metadataUrl = `/api/paste/${this.id}`;
    return {
      view: viewUrl,
      direct: directUrl,
      metadata: metadataUrl,
    };
  }

  [OptionalProps]: "owner" | "createdAt" | "expiresAt" | "extension" | "urls" | "paths";
}

export class CreatePasteDto {
  @IsString()
  @Length(1, config.maxPasteLength)
  content: string;

  @IsBoolean()
  encrypted: boolean;

  @IsString()
  @Length(1, 10)
  @IsOptional()
  extension?: string;

  @IsBoolean()
  @IsOptional()
  burn: boolean;

  @IsBoolean()
  @IsOptional()
  paranoid: boolean;

  @IsNumber()
  @IsOptional()
  expiresAt?: number;
}
