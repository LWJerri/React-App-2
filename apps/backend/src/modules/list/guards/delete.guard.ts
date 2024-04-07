import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DeleteListGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest<Request<{ id: string; boardId: string }>>();

    const { id, boardId } = params;

    const isListExists = await this.prismaService.list.findUnique({
      where: { id, boardId },
      select: { isDeleted: true },
    });

    if (!isListExists || isListExists.isDeleted) {
      throw new NotFoundException("A list with this id was not found in the database.");
    }

    return true;
  }
}
