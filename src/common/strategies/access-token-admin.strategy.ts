import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";

@Injectable()
export class AccessTokenAdminStrategy extends PassportStrategy(
  Strategy,
  "access-jwt-admin" // <-- alohida nom bering
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ADMIN_ACCESS_TOKEN_KEY!, // make sure this is for admin
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayload {
    console.log("ADMIN JWT payload", payload);
    return payload;
  }
}
