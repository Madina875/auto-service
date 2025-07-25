import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, role, phone, password, confirm_password } =
      createUserDto;
    if (password !== confirm_password) {
      throw new BadRequestException("parollar mos emas");
    }
    const hashedPassword = await bcrypt.hash(password!, 7);

    return this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        hashedPassword,
        role,
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    await this.prismaService.user.delete({ where: { id } });
    return "deleted successfully !!!!";
  }
}
