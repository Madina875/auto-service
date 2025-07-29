import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

import { Request, Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInUserDto } from "../users/dto/signin-user.dto";
import { CreateAdminDto, SignInAdminDto } from "../admin/dto";
import {
  GetCurrentAdminId,
  GetCurrentUserId,
  GetCurrrentAdmin,
  GetCurrrentUser,
} from "../common/decorators";
import { RefreshTokenAdminGuard, RefreshTokenGuard } from "../common/guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //-------------------------------------------USER ------------------------------------------------//

  @Post("users/signup")
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post("users/signin")
  async sigin(
    @Body() singInUserDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signin(singInUserDto, res);
  }

  @Get("users/activate/:link")
  async activate(@Param("link") activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("users/signout")
  @HttpCode(HttpStatus.OK)
  async signout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signout(userId, res);
  }

  @UseGuards(RefreshTokenGuard)
  @Post("users/refresh")
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.updateRefreshToken(userId, refreshToken, res);
  }

  //------------------------------------------------------------------------------------------//

  //-----------------------------------------ADMIN-------------------------------------------------//

  @Post("admin/signup")
  async signupAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.signupAdmin(createAdminDto);
  }

  @Post("admin/signin")
  async siginAdmin(
    @Body() singInAdminDto: SignInAdminDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signinAdmin(singInAdminDto, res);
  }

  @Get("admin/activate/:link")
  async activateAdmin(@Param("link") activationLink: string) {
    return this.authService.activateAdmin(activationLink);
  }

  @UseGuards(RefreshTokenAdminGuard)
  @Post("admin/signout")
  @HttpCode(HttpStatus.OK)
  async signoutAdmin(
    @GetCurrentAdminId() adminIn: number,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signoutAdmin(adminIn, res);
  }

  @UseGuards(RefreshTokenAdminGuard)
  @Post("admin/refresh")
  @HttpCode(HttpStatus.OK)
  async refreshTokenAdmin(
    @GetCurrentAdminId() adminId: number,
    @GetCurrrentAdmin("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.updateRefreshTokenAdmin(adminId, refreshToken, res);
  }

  //------------------------------------------------------------------------------------------//
}
