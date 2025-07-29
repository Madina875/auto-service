import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "../prisma/prisma.module";
import { MailModule } from "../mail/mail.module";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AdminModule } from "../admin/admin.module";
import {
  AccessTokenAdminStrategy,
  AccessTokenStrategy,
  RefreshTokenAdminStrategy,
  RefreshTokenStrategyCookie,
} from "../common/strategies";

@Module({
  imports: [
    JwtModule.register({}),
    PrismaModule,
    UsersModule,
    MailModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategyCookie,
    AccessTokenAdminStrategy,
    RefreshTokenAdminStrategy,
  ],
})
export class AuthModule {}
