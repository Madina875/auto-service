import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";

import { Request, Response } from "express";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInUserDto } from "../users/dto/signin-user.dto";
import { CreateAdminDto, SignInAdminDto } from "../admin/dto";

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

  @Post("users/signout/:id")
  async signout(@Param("id", ParseIntPipe) id: number, @Res() res: Response) {
    return this.authService.signout(id, res);
  }

  @Get("users/refresh/:id")
  async refreshToken(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.authService.updateRefreshToken(id, req, res);
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

  @Post("admin/signout/:id")
  async signoutAdmin(
    @Param("id", ParseIntPipe) id: number,
    @Res() res: Response
  ) {
    return this.authService.signoutAdmin(id, res);
  }

  @Get("admin/refresh/:id")
  async refreshTokenAdmin(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response
  ) {
    return this.authService.updateRefreshTokenAdmin(id, req, res);
  }

  //------------------------------------------------------------------------------------------//
}
