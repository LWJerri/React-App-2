import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { AuditModule } from "../audit/audit.module";
import { BoardModule } from "../board/board.module";
import { ListModule } from "../list/list.module";
import { TaskModule } from "../task/task.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(),
    AuditModule,
    BoardModule,
    ListModule,
    TaskModule,
  ],
})
export class AppModule {}
