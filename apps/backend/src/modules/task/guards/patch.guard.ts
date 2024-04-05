import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { PatchTaskDto } from "../dto/patch.dto";

@Injectable()
export class PatchTaskGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { body, params } = context.switchToHttp().getRequest<Request<{ boardId: string }, any, PatchTaskDto>>();

    if (body?.listId === "") throw new BadRequestException("listId field must have correct id, if present.");

    if (body.listId) {
      const isListExists = await this.prismaService.list.findUnique({
        where: { id: String(body.listId), boardId: params.boardId },
        select: { id: true },
      });

      if (!isListExists) throw new NotFoundException("No new list with this Id in this board was found.");
    }

    return true;
  }
}
