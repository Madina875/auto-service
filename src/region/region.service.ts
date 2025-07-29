import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RegionService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createRegionDto: CreateRegionDto) {
    return this.prismaService.region.create({
      data: createRegionDto,
    });
  }

  findAll() {
    return this.prismaService.region.findMany({ include: { districts: true } });
  }

  async findOne(id: number) {
    const region = await this.prismaService.region.findUnique({
      where: { id },
    });

    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto) {
    const region = await this.prismaService.region.findUnique({
      where: { id },
    });

    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    return this.prismaService.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: number) {
    const region = await this.prismaService.region.findUnique({
      where: { id },
    });

    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }

    return this.prismaService.region.delete({
      where: { id },
    });
  }
}
