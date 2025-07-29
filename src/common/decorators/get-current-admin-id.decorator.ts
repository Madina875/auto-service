import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { JwtPayload, JwtPayloadAdmin } from "../types";

export const GetCurrentAdminId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const admin = request.user as JwtPayloadAdmin;
    if (!admin) {
      throw new ForbiddenException("Token noto'g'ri.");
    }
    console.log("admin", admin);
    return admin.id;
  }
);

//faqat guard dan keyin ishlatish zarur (refreshTokenGuard)
