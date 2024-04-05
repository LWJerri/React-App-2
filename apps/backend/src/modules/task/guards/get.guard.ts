import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GetTaskGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest<Request<{ id: string; boardId: string; listId: string }>>();

    const { boardId, listId, id } = params;

    const isTaskExists = await this.prismaService.task.findUnique({
      where: { id, list: { boardId }, listId },
      select: { id: true },
    });

    if (!isTaskExists) throw new NotFoundException("No task with this Id was found.");

    return true;
  }
}
