import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    const logger = new Logger(PrismaService.name);

    try {
      await this.$connect();

      logger.log("Connected to database.");
    } catch (err) {
      logger.fatal("Can't connect to database!", err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
