import { Module } from "@nestjs/common";
import { CarHistoryService } from "./car_history.service";
import { CarHistoryController } from "./car_history.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CarHistoryController],
  providers: [CarHistoryService],
})
export class CarHistoryModule {}
