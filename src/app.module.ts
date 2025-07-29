import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { MailModule } from "./mail/mail.module";
import { CarModule } from './car/car.module';
import { CarHistoryModule } from './car_history/car_history.module';
import { RegionModule } from './region/region.module';
import { DistrictModule } from './district/district.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    UsersModule,
    AdminModule,
    AuthModule,
    PrismaModule,
    MailModule,
    CarModule,
    CarHistoryModule,
    RegionModule,
    DistrictModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
