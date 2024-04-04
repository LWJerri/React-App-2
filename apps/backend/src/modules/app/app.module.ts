import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { BoardModule } from "../board/board.module";
import { ListModule } from "../list/list.module";
import { TaskModule } from "../task/task.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), LoggerModule.forRoot(), BoardModule, ListModule, TaskModule],
})
export class AppModule {}
