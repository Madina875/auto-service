import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { MailModule } from "./mail/mail.module";
import { CarModule } from './car/car.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    UsersModule,
    AdminModule,
    AuthModule,
    PrismaModule,
    MailModule,
    CarModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
