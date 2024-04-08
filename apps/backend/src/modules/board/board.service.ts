import { Injectable } from "@nestjs/common";
import { ResponseListDto } from "../list/dto/response.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ResponseTaskDto } from "../task/dto/response.dto";
import { CreateBoardDto } from "./dto/create.dto";
import { PatchBoardDto } from "./dto/patch.dto";
import { ResponseBoardAuditDto } from "./dto/responseAudit.dto";
import { ResponseBoardDto } from "./dto/responseBoards.dto";
import { ResponseBoardWithListFieldDto } from "./dto/responseWithListField.dto";

@Injectable()
export class BoardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAudit(boardId: string): Promise<ResponseBoardAuditDto[]> {
    const retrieveAuditLog = await this.prismaService.auditLog.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      select: {
        action: true,
        relatedModel: true,
        relatedId: true,
        affectedField: true,
        createdAt: true,
        newState: true,
        oldState: true,
        boardId: true,
      },
    });

    const response: ResponseBoardAuditDto[] = retrieveAuditLog.map((log) => ({
      oldState: log.oldState as unknown as ResponseListDto | ResponseTaskDto,
      newState: log.newState as unknown as ResponseListDto | ResponseTaskDto,
      action: log.action,
      boardId: log.boardId,
      affectedField: log.affectedField,
      createdAt: log.createdAt,
      relatedModel: log.relatedModel,
      relatedId: log.relatedId,
    }));

    return response;
  }

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
