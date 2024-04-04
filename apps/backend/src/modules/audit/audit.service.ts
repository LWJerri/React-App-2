import { Injectable } from "@nestjs/common";
import { ResponseListDto } from "../list/dto/response.dto";
import { PrismaService } from "../prisma/prisma.service";
import { ResponseTaskDto } from "../task/dto/response.dto";
import { ResponseAuditDto } from "./dto/response.dto";

@Injectable()
export class AuditService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAudit(boardId: string): Promise<ResponseAuditDto[]> {
    const retrieveAuditLog = await this.prismaService.auditLog.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" },
      select: {
        action: true,
        relatedModel: true,
        affectedField: true,
        createdAt: true,
        newState: true,
        oldState: true,
        boardId: true,
      },
    });

    const response: ResponseAuditDto[] = retrieveAuditLog.map((log) => ({
      oldState: log.oldState as unknown as ResponseListDto | ResponseTaskDto,
      newState: log.newState as unknown as ResponseListDto | ResponseTaskDto,
      action: log.action,
      boardId: log.boardId,
      affectedField: log.affectedField,
      createdAt: log.createdAt,
      relatedModel: log.relatedModel,
    }));

    return response;
  }
}
