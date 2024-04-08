import { Injectable } from "@nestjs/common";
import { Action, List, Model, Task } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prismaService: PrismaService) {}

  async log(
    action: Action,
    boardId: string,
    relatedId: string,
    affectedField: string,
    relatedModel: Model,
    newState?: List | Task,
    oldState?: List | Task,
  ) {
    await this.prismaService.auditLog.create({
      data: { action, boardId, relatedId, affectedField, relatedModel, newState, oldState },
    });
  }
}
