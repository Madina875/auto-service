import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCarDto, UpdateCarDto } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CarService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: createCarDto.userId },
    });

    if (!user) {
      throw new NotFoundException("not found user");
    }

    return this.prismaService.car.create({
      data: {
        plate_number: createCarDto.plate_number,
        vin_number: createCarDto.vin_number,
        model: createCarDto.model,
        year: createCarDto.year,
        user: { connect: { id: createCarDto.userId } },
      },
    });
  }

  findAll() {
    return this.prismaService.car.findMany({
      include: { car_history: { include: { user: true } } },
    });
  }

  findOne(id: number) {
    return this.prismaService.car.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const existingCar = await this.prismaService.car.findUnique({
      where: { id },
    });

    if (!existingCar) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return this.prismaService.car.update({
      where: { id },
      data: {
        plate_number: updateCarDto.plate_number,
        vin_number: updateCarDto.vin_number,
        model: updateCarDto.model,
        year: updateCarDto.year,
      },
    });
  }

  async remove(id: number) {
    const existingCar = await this.prismaService.car.findUnique({
      where: { id },
    });

    if (!existingCar) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return this.prismaService.car.delete({
      where: { id },
    });
  }
}
