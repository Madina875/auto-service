import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCarHistoryDto } from "./dto/create-car_history.dto";
import { UpdateCarHistoryDto } from "./dto/update-car_history.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CarHistoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCarHistoryDto: CreateCarHistoryDto) {
    return this.prismaService.carHistory.create({
      data: createCarHistoryDto,
    });
  }

  async findAll() {
    return this.prismaService.carHistory.findMany({
      include: { user: true, car: true },
    });
  }

  async findOne(id: number) {
    const history = await this.prismaService.carHistory.findUnique({
      where: { id },
      include: { user: true, car: true },
    });

    if (!history) {
      throw new NotFoundException(`Car history with ID ${id} not found`);
    }

    return history;
  }

  async update(id: number, updateCarHistoryDto: UpdateCarHistoryDto) {
    const existing = await this.prismaService.carHistory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Car history with ID ${id} not found`);
    }

    return this.prismaService.carHistory.update({
      where: { id },
      data: updateCarHistoryDto,
    });
  }

  async remove(id: number) {
    const existing = await this.prismaService.carHistory.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Car history with ID ${id} not found`);
    }

    return this.prismaService.carHistory.delete({
      where: { id },
    });
  }
}
