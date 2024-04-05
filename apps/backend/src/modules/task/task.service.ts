import { Injectable } from "@nestjs/common";
import { Task } from "@prisma/client";
import { updatedDiff } from "deep-object-diff";
import { AuditService } from "../audit/audit.service";
import { ResponseBoardAuditTaskDto } from "../board/dto/responseAudit.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create.dto";
import { PatchTaskDto } from "./dto/patch.dto";
import { ResponseTaskDto } from "./dto/response.dto";

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getTasks(boardId: string, listId: string): Promise<ResponseTaskDto[]> {
    const tasks = await this.prismaService.task.findMany({
      where: { listId, list: { boardId } },
      orderBy: { createdAt: "desc" },
      include: { list: { select: { boardId: true } } },
    });

    const response = tasks.map((task) => {
      return { ...task, boardId: task.list.boardId };
    });

    return response;
  }

  async getAudit(boardId: string, taskId: string): Promise<ResponseBoardAuditTaskDto[]> {
    const retrieveAuditLog = await this.prismaService.auditLog.findMany({
      where: { relatedId: taskId, relatedModel: "TASK", boardId },
      orderBy: { createdAt: "desc" },
      select: {
        action: true,
        relatedModel: true,
        affectedField: true,
        createdAt: true,
        newState: true,
        oldState: true,
      },
    });

    const response: ResponseBoardAuditTaskDto[] = retrieveAuditLog.map((log) => ({
      oldState: log.oldState as unknown as ResponseTaskDto,
      newState: log.newState as unknown as ResponseTaskDto,
      boardId,
      action: log.action,
      affectedField: log.affectedField,
      createdAt: log.createdAt,
      relatedModel: log.relatedModel,
    }));

    return response;
  }

  async getTask(boardId: string, listId: string, taskId: string): Promise<ResponseTaskDto> {
    const task = await this.prismaService.task.findUnique({ where: { id: taskId, listId, list: { boardId } } });

    return { ...task!, boardId };
  }

  async createTask(body: CreateTaskDto, boardId: string, listId: string): Promise<ResponseTaskDto> {
    const task = await this.prismaService.task.create({ data: { ...body, listId } });

    await this.auditService.createLog("CREATE", boardId, "name", task.id, "TASK", task);

    return { ...task, boardId };
  }

  async patchTask(body: PatchTaskDto, boardId: string, listId: string, taskId: string): Promise<ResponseTaskDto> {
    const prepOldState = await this.prismaService.task.findUnique({ where: { id: taskId, list: { boardId }, listId } });
    const oldState = prepOldState!;

    const task = await this.prismaService.task.update({
      where: { id: taskId, list: { boardId }, listId },
      data: { ...body, updatedAt: new Date() },
    });

    const updatedAtKey: keyof Task = "updatedAt";

    const prepNewChanges = updatedDiff(oldState, task);
    const newChanges = Object.keys(prepNewChanges).filter((key) => key !== updatedAtKey);

    newChanges.map(async (key) => {
      await this.auditService.createLog("EDIT", boardId, key, task.id, "TASK", task, oldState);
    });

    return { ...task, boardId };
  }

  async deleteTask(boardId: string, listId: string, taskId: string) {
    const task = await this.prismaService.task.delete({ where: { id: taskId, list: { boardId }, listId } });

    await this.auditService.createLog("DELETE", boardId, "name", task.id, "TASK", task);
  }
}
