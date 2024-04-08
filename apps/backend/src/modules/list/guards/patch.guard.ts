import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { PatchListDto } from "../dto/patch.dto";

@Injectable()
export class PatchListGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { body, params } = context
      .switchToHttp()
      .getRequest<Request<{ id: string; boardId: string }, any, PatchListDto>>();

    const { id, boardId } = params;

    const isListExists = await this.prismaService.list.findUnique({ where: { id, boardId }, select: { name: true } });

    if (!isListExists) throw new NotFoundException("The list with this id was not found in the database.");

    if (isListExists.name === String(body.name)) {
      throw new BadRequestException("The new list name cannot be like the current list name.");
    }

    return true;
  }
}
