import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mail.serivce";

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>("smtp_host"),
          secure: false,
          auth: {
            user: config.get<string>("smtp_user"),
            pass: config.get<string>("smtp_password"),
          },
        },
        defaults: {
          from: `"Dermanit service" <${config.get<string>("smtp_user")}>`,
        },
        template: {
          dir: join(process.cwd(), "src", "mail", "templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
