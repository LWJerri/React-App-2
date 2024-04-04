import { Injectable } from "@nestjs/common";
import { List, Prisma } from "@prisma/client";
import { updatedDiff } from "deep-object-diff";
import { PrismaService } from "../prisma/prisma.service";
import { CreateListDto } from "./dto/create.dto";
import { PatchListDto } from "./dto/patch.dto";
import { ResponseListDto } from "./dto/response.dto";
import { ResponseListWithTaskFieldDto } from "./dto/responseWithTaskField.dto";

@Injectable()
export class ListService {
  constructor(private readonly prismaService: PrismaService) {}

  async getLists(boardId: string): Promise<ResponseListWithTaskFieldDto[]> {
    const retrieveLists = await this.prismaService.list.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      include: { _count: true },
    });

    const lists = retrieveLists.map((list) => {
      const { _count, ...fields } = list;

      return { ...fields, ..._count };
    });

    return lists;
  }

  async createList(body: CreateListDto, boardId: string): Promise<Omit<ResponseListDto, "task">> {
    const list = await this.prismaService.list.create({ data: { ...body, boardId } });

    await this.prismaService.auditLog.create({
      data: {
        action: "CREATE",
        boardId,
        affectedField: "name",
        relatedId: list.id,
        relatedModel: "LIST",
        newState: list,
      },
    });

    return list;
  }

  async patchList(body: PatchListDto, id: string, boardId: string): Promise<ResponseListDto> {
    const prepOldState = await this.prismaService.list.findUnique({ where: { id, boardId } });
    const oldState = prepOldState!;

    const prepList = await this.prismaService.list.update({
      where: { id, boardId },
      data: { ...body, updatedAt: new Date() },
      include: { _count: true },
    });
    const { _count, ...fields } = prepList;

    const updatedAtKey: keyof List = "updatedAt";

    const prepNewChanges = updatedDiff(oldState, prepList);
    const newChanges = Object.keys(prepNewChanges).filter((key) => key !== updatedAtKey);

    const auditLogData: Prisma.AuditLogCreateManyInput[] = newChanges.map((key) => ({
      action: "EDIT",
      boardId,
      affectedField: key,
      relatedId: prepList.id,
      relatedModel: "LIST",
      newState: prepList,
      oldState,
    }));

    await this.prismaService.auditLog.createMany({ data: auditLogData });

    return { ...fields, ..._count };
  }

  async deleteList(id: string, boardId: string) {
    const list = await this.prismaService.list.delete({ where: { id, boardId } });

    await this.prismaService.auditLog.create({
      data: {
        action: "DELETE",
        boardId,
        affectedField: "name",
        relatedId: list.id,
        relatedModel: "LIST",
        oldState: list,
      },
    });
  }
}
