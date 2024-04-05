import { Injectable } from "@nestjs/common";
import { List } from "@prisma/client";
import { updatedDiff } from "deep-object-diff";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateListDto } from "./dto/create.dto";
import { PatchListDto } from "./dto/patch.dto";
import { ResponseListDto } from "./dto/response.dto";
import { ResponseListWithTaskFieldDto } from "./dto/responseWithTaskField.dto";

@Injectable()
export class ListService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

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

    await this.auditService.createLog("CREATE", boardId, "name", list.id, "LIST", list);

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

    newChanges.map(async (key) => {
      await this.auditService.createLog("EDIT", boardId, key, prepList.id, "LIST", prepList, oldState);
    });

    return { ...fields, ..._count };
  }

  async deleteList(id: string, boardId: string) {
    const list = await this.prismaService.list.update({
      where: { id, boardId },
      data: { isDeleted: true, updatedAt: new Date() },
    });

    await this.auditService.createLog("DELETE", boardId, "name", list.id, "LIST", list);
  }
}
