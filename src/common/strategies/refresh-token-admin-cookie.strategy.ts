import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";

export const adminCookieExtractor: JwtFromRequestFunction = (req: Request) => {
  console.log("Admin cookies:", req.cookies);
  if (req && req.cookies) {
    return req.cookies["refreshToken"];
  }
  return null;
};

@Injectable()
export class RefreshTokenAdminStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt-admin" // ALTERNATIVE NAME for ADMIN
) {
  constructor() {
    super({
      jwtFromRequest: adminCookieExtractor,
      secretOrKey: process.env.ADMIN_REFRESH_TOKEN_KEY!, // admin-specific key
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ForbiddenException(
        "Refresh token is missing or invalid (admin)"
      );
    }
    return { ...payload, refreshToken };
  }
}
