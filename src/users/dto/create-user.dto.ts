import { Role } from "../../../generated/prisma";

export class CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role?: Role;
  confirm_password?: string;
  activation_link?: string;
  is_active?: boolean;
  is_approved?: boolean;
}
