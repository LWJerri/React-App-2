import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GetListGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest<Request<{ boardId: string }>>();

    const isBoardExists = await this.prismaService.board.findUnique({
      where: { id: params.boardId },
      select: { id: true },
    });

    if (!isBoardExists) throw new BadRequestException("A board with this id not found.");

    return true;
  }
}
