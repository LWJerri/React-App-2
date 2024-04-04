import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GetAuditGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { query } = context.switchToHttp().getRequest<Request<any, any, any, { boardId?: string }>>();

    if (!query?.boardId) throw new BadRequestException("boardId query is required.");

    const isBoardExists = await this.prismaService.board.findUnique({
      where: { id: query.boardId },
      select: { id: true },
    });

    if (!isBoardExists) throw new BadRequestException("A board with this Id not found.");

    return true;
  }
}
