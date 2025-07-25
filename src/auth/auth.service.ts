import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { Admin, User } from "../../generated/prisma";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { MailService } from "../mail/mail.serivce";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInUserDto } from "../users/dto/signin-user.dto";
import { CreateAdminDto, SignInAdminDto } from "../admin/dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  private async generateTokens(user: User) {
    const jwtConfigByRole = {
      OWNER: {
        accessSecret: process.env.OWNER_ACCESS_TOKEN_KEY,
        accessExpire: process.env.OWNER_ACCESS_TOKEN_TIME,
        refreshSecret: process.env.OWNER_REFRESH_TOKEN_KEY,
        refreshExpire: process.env.OWNER_REFRESH_TOKEN_TIME,
      },
      CLIENT: {
        accessSecret: process.env.CLIENT_ACCESS_TOKEN_KEY,
        accessExpire: process.env.CLIENT_ACCESS_TOKEN_TIME,
        refreshSecret: process.env.CLIENT_REFRESH_TOKEN_KEY,
        refreshExpire: process.env.CLIENT_REFRESH_TOKEN_TIME,
      },
      WORKER: {
        accessSecret: process.env.WORKER_ACCESS_TOKEN_KEY,
        accessExpire: process.env.WORKER_ACCESS_TOKEN_TIME,
        refreshSecret: process.env.WORKER_REFRESH_TOKEN_KEY,
        refreshExpire: process.env.WORKER_REFRESH_TOKEN_TIME,
      },
    };
    const role = user.role!.toUpperCase();
    const jwtConfig = jwtConfigByRole[role];

    if (!jwtConfig) {
      throw new Error(`JWT config not found for role: ${role}`);
    }

    const payload = {
      id: user.id,
      email: user.email,
      is_active: user.is_active,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.accessSecret,
        expiresIn: jwtConfig.accessExpire,
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshExpire,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateTokensAdmin(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      is_owner: admin.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_ACCESS_TOKEN_KEY,
        expiresIn: process.env.ADMIN_ACCESS_TOKEN_TIME,
      }),

      this.jwtService.signAsync(payload, {
        secret: process.env.ADMIN_REFRESH_TOKEN_KEY,
        expiresIn: process.env.ADMIN_REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(createUserDto: CreateUserDto) {
    const { name, email, role, phone, password, confirm_password } =
      createUserDto;

    if (!role) {
      throw new BadRequestException("Role is required");
    }
    if (password !== confirm_password) {
      throw new BadRequestException("parollar mos emas");
    }
    const hashedPassword = await bcrypt.hash(password!, 7);

    const candidate = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException("already exists");
    }

    const activation_link = uuidv4();

    const newUser = await this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        role,
        hashedPassword,
        activation_link: activation_link,
      },
    });

    try {
      await this.mailService.sendUserActivationLink(newUser);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException("Email error occurred");
    }

    return {
      id: newUser.id,
      message: "Ro'yhatdan o'tdingiz. Email orqali akkauntni faollashtiring.",
    };
  }

  async signupAdmin(createAdminDto: CreateAdminDto) {
    const { name, email, phone, password, confirm_password } = createAdminDto;

    if (password !== confirm_password) {
      throw new BadRequestException("parollar mos emas");
    }
    const hashedPassword = await bcrypt.hash(password!, 7);

    const candidate = await this.prismaService.admin.findUnique({
      where: { email },
    });

    if (candidate) {
      throw new ConflictException("already exists");
    }

    const activation_link = uuidv4();

    const newAdmin = await this.prismaService.admin.create({
      data: {
        name,
        email,
        phone,
        hashedPassword,
        activation_link: activation_link,
      },
    });

    try {
      await this.mailService.sendAdminActivationLink(newAdmin);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException("Email error occurred");
    }

    return {
      id: newAdmin.id,
      message: "Ro'yhatdan o'tdingiz. Email orqali akkauntni faollashtiring.",
    };
  }

  async signin(signInUserDto: SignInUserDto, res: Response) {
    const { email, password } = signInUserDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException("email or password incorrect");
    }

    const isValidpassword = await bcrypt.compare(password, user.hashedPassword);

    if (!isValidpassword) {
      throw new NotFoundException("email or password incorrect");
    }

    const { accessToken, refreshToken } = await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return {
      message: "foydalanuvchi tizimga kirdi",
      userId: user.id,
      accessToken,
    };
  }

  async signinAdmin(signInAdminDto: SignInAdminDto, res: Response) {
    const { email, password } = signInAdminDto;
    const admin = await this.prismaService.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new NotFoundException("email or password incorrect 1");
    }

    const isValidpassword = await bcrypt.compare(
      password!,
      admin!.hashedPassword
    );

    if (!isValidpassword) {
      throw new NotFoundException("email or password incorrect");
    }

    const { accessToken, refreshToken } = await this.generateTokensAdmin(
      admin!
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);

    await this.prismaService.admin.update({
      where: { id: admin!.id },
      data: { hashedRefreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return {
      message: "foydalanuvchi tizimga kirdi",
      adminId: admin!.id,
      accessToken,
    };
  }

  async activate(activationLink: string) {
    const user = await this.prismaService.user.findFirst({
      where: { activation_link: activationLink },
    });

    if (!user) throw new NotFoundException("Activation link invalid");

    if (user.is_active)
      throw new ConflictException("Account already activated");
    await this.prismaService.user.update({
      where: { id: user.id },
      data: { is_active: true },
    });

    return { message: "Account activated!" };
  }

  async activateAdmin(activationLink: string) {
    const admin = await this.prismaService.admin.findFirst({
      where: { activation_link: activationLink },
    });

    if (!admin) throw new NotFoundException("Activation link invalid");

    if (admin.is_active)
      throw new ConflictException("Account already activated");
    await this.prismaService.admin.update({
      where: { id: admin.id },
      data: { is_active: true },
    });

    return { message: "Account activated!" };
  }

  async signout(id: number, res: Response) {
    const candidate = await this.prismaService.user.findUnique({
      where: { id },
    });

    await this.prismaService.user.update({
      where: { id: candidate!.id },
      data: { hashedRefreshToken: null },
    });

    res.clearCookie("refreshToken");
    res.json({ message: `User with id ${id} signed out successfully!` });
  }

  async signoutAdmin(id: number, res: Response) {
    const candidate = await this.prismaService.admin.findUnique({
      where: { id },
    });

    await this.prismaService.admin.update({
      where: { id: candidate!.id },
      data: { hashedRefreshToken: null },
    });

    res.clearCookie("refreshToken");
    res.json({ message: `Admin with id ${id} signed out successfully!` });
  }

  async updateRefreshToken(id: number, req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException("Refresh token not found in cookies");
    }

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user || !user.hashedRefreshToken) {
      throw new NotFoundException("User or token not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken
    );

    if (!tokenMatch) {
      throw new BadRequestException("Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 7);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Tokens refreshed",
      accessToken,
    });
  }

  async updateRefreshTokenAdmin(id: number, req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException("Refresh token not found in cookies");
    }

    const admin = await this.prismaService.admin.findUnique({
      where: { id },
    });

    if (!admin || !admin.hashedRefreshToken) {
      throw new NotFoundException("User or token not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      admin.hashedRefreshToken
    );

    if (!tokenMatch) {
      throw new BadRequestException("Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokensAdmin(admin);

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 7);

    await this.prismaService.admin.update({
      where: { id: admin.id },
      data: { hashedRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: +process.env.COOKIE_TIME!,
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Tokens refreshed",
      accessToken,
    });
  }
}
