import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBoardDto } from "./dto/create.dto";
import { PatchBoardDto } from "./dto/patch.dto";
import { ResponseBoardDto } from "./dto/response.dto";
import { ResponseBoardWithListFieldDto } from "./dto/responseWithListField.dto";

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getBoards(): Promise<ResponseBoardWithListFieldDto[]> {
    const retrieveBoards = await this.prismaService.board.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: true },
    });

    const boards = retrieveBoards.map((board) => {
      const { _count, ...fields } = board;

      return { ...fields, ..._count };
    });

    return boards;
  }

  async createBoard(body: CreateBoardDto): Promise<Omit<ResponseBoardDto, "list">> {
    const board = await this.prismaService.board.create({ data: { ...body } });

    return board;
  }

  async patchBoard(body: PatchBoardDto, id: string): Promise<ResponseBoardDto> {
    const prepBoard = await this.prismaService.board.update({
      where: { id },
      data: { ...body, updatedAt: new Date() },
      include: { _count: true },
    });

    const { _count, ...fields } = prepBoard;

    return { ...fields, ..._count };
  }

  async deleteBoard(id: string) {
    await this.prismaService.board.delete({ where: { id } });
  }
}
