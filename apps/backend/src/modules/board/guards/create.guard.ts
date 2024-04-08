import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateBoardDto } from "../dto/create.dto";

@Injectable()
export class CreateBoardGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { body } = context.switchToHttp().getRequest<Request<any, any, CreateBoardDto>>();

    const isBoardAlreadyCreated = await this.prismaService.board.findFirst({
      where: { name: { mode: "insensitive", equals: String(body.name) } },
      select: { id: true },
    });

    if (isBoardAlreadyCreated) throw new BadRequestException("A board by that name already exists.");

    return true;
  }
}
