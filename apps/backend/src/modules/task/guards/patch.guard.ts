import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { PatchTaskDto } from "../dto/patch.dto";

@Injectable()
export class PatchTaskGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { body, params } = context.switchToHttp().getRequest<Request<{ boardId: string }, any, PatchTaskDto>>();

    if (body?.listId === "") {
      throw new BadRequestException("The new list id must be explicitly specified if the field is present.");
    }

    if (body.listId) {
      const isListExists = await this.prismaService.list.findUnique({
        where: { id: String(body.listId), boardId: params.boardId },
        select: { id: true },
      });

      if (!isListExists) throw new NotFoundException("The id of the new list was not found in the database.");
    }

    return true;
  }
}
