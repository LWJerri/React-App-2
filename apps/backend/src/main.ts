import { RedocModule } from "@brakebein/nestjs-redoc";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";
import { AppModule } from "./modules/app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const logger = app.get(Logger);

  const configService = app.get(ConfigService);
  const appPort = configService.get<number | string>("PORT")!;

  const options = new DocumentBuilder()
    .setTitle("Task Manager V2 API")
    .setDescription("Documentation with all possible API endpoints for this project.")
    .build();

  const document = SwaggerModule.createDocument(app, options);

  await Promise.all([app.listen(appPort, "0.0.0.0"), RedocModule.setup("/", app, document, {})]);

  logger.log(`🚀 API ready on ${appPort} port.`);
}

bootstrap();
