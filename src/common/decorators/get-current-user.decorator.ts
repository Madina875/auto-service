import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";

export const GetCurrrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRefreshToken, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    console.log(user);
    console.log(data);

    if (!user) {
      throw new ForbiddenException("Token noto'g'ri.");
    }
    if (!data) {
      return user;
    }
    return user[data];
  }
);
