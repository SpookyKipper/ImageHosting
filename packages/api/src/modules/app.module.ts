import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import MikroOrmOptions from "../mikro-orm.config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { FileModule } from "./file/file.module";
import { HostsModule } from "./hosts/hosts.module";
import { InviteModule } from "./invite/invite.module";
import { StorageModule } from "./storage/storage.module";
import { ThumbnailModule } from "./thumbnail/thumbnail.module";
import { UserModule } from "./user/user.module";

@Module({
  controllers: [AppController],
  providers: [],
  imports: [
    MikroOrmModule.forRoot(MikroOrmOptions),
    PassportModule,
    StorageModule,
    HostsModule,
    AuthModule,
    FileModule,
    ThumbnailModule,
    InviteModule,
    UserModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
