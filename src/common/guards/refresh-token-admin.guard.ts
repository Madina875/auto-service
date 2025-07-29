import { AuthGuard } from "@nestjs/passport";

export class RefreshTokenAdminGuard extends AuthGuard("refresh-jwt-admin") {
  constructor() {
    super();
  }
}
