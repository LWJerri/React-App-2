import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class GetBoardGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { params } = context.switchToHttp().getRequest<Request<{ id: string }>>();

    const isBoardExists = await this.prismaService.board.findUnique({ where: { id: params.id }, select: { id: true } });

    if (!isBoardExists) throw new NotFoundException("No board with this Id was found.");

    return true;
  }
}
