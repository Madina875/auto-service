import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDistrictDto } from "./dto/create-district.dto";
import { UpdateDistrictDto } from "./dto/update-district.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DistrictService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDistrictDto: CreateDistrictDto) {
    return this.prismaService.district.create({
      data: createDistrictDto,
    });
  }

  findAll() {
    return this.prismaService.district.findMany({
      include: {
        region: true,
      },
    });
  }

  async findOne(id: number) {
    const district = await this.prismaService.district.findUnique({
      where: { id },
      include: { region: true },
    });

    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }

    return district;
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto) {
    const district = await this.prismaService.district.findUnique({
      where: { id },
    });

    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }

    return this.prismaService.district.update({
      where: { id },
      data: updateDistrictDto,
    });
  }

  async remove(id: number) {
    const district = await this.prismaService.district.findUnique({
      where: { id },
    });

    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }

    return this.prismaService.district.delete({
      where: { id },
    });
  }
}
