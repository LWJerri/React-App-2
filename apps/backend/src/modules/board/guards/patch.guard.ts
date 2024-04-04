import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../../prisma/prisma.service";
import { PatchBoardDto } from "../dto/patch.dto";

@Injectable()
export class PatchBoardGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const { body, params } = context.switchToHttp().getRequest<Request<{ id: string }, any, PatchBoardDto>>();

    const isBoardExists = await this.prismaService.board.findUnique({
      where: { id: params.id },
      select: { name: true },
    });

    if (!isBoardExists) throw new NotFoundException("No board with this Id was found.");

    if (isBoardExists.name === String(body.name)) {
      throw new BadRequestException("New board name cannot be as the current name.");
    }

    return true;
  }
}
