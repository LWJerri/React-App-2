import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from "@nestjs/swagger";
import { FallbackResponse } from "src/helpers/FallbackResponse";
import { responseStatus } from "src/helpers/constants";
import { AuditService } from "./audit.service";
import { ResponseAuditDto } from "./dto/response.dto";
import { GetAuditGuard } from "./guards/get.guard";

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({
    summary: "Audit log per board",
    description: "This request will return the entire history of actions on lists and tasks.",
  })
  @ApiOkResponse({ type: ResponseAuditDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiQuery({
    name: "boardId",
    example: "clulefm59000108l9fnpr6w7t",
    description: "Provide board Id which you want to get audit.",
  })
  @UseGuards(GetAuditGuard)
  getAudit(@Query("boardId") boardId: string) {
    return this.auditService.getAudit(boardId);
  }
}
