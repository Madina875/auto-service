import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import chalk from "chalk";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<number>("PORT");

  app.setGlobalPrefix("api");
  app.use(cookieParser());

  await app.listen(PORT ?? 3030, () => {
    console.log(`
    ${chalk.magentaBright.magentaBright(" Auto Service system Online! 🚘")}
    🔗 URL: ${chalk.cyan.underline(`http://localhost:${PORT}`)}
    🕓 Time: ${chalk.gray(new Date().toLocaleTimeString())}
    `);
  });
}
bootstrap();
