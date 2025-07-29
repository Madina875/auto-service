import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import {
  JwtPayload,
  JwtPayloadAdmin,
  JwtPayloadWithRefreshToken,
} from "../types";

export const GetCurrrentAdmin = createParamDecorator(
  (data: keyof JwtPayloadWithRefreshToken, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const admin = request.user as JwtPayloadAdmin;
    console.log(admin);
    console.log(data);

    if (!admin) {
      throw new ForbiddenException("Token noto'g'ri.");
    }
    if (!data) {
      return;
    }
    return admin[data];
  }
);
