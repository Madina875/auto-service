import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { Admin, User } from "../../generated/prisma";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserActivationLink(user: User) {
    const url = `${process.env.api_url}/api/auth/users/activate/${user.activation_link}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Auto Service System (User)",
      template: "confirmation",
      context: {
        username: user.name,
        url,
      },
    });
  }

  async sendAdminActivationLink(admin: Admin) {
    const url = `${process.env.api_url}/api/auth/admin/activate/${admin.activation_link}`;
    await this.mailerService.sendMail({
      to: admin.email,
      subject: "Welcome to Auto System App! (Admin)",
      template: "admin_confirmation",
      context: {
        username: admin.name,
        url,
      },
    });
  }
}
