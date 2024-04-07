import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from "@nestjs/swagger";
import { FallbackResponse } from "../../helpers/FallbackResponse";
import { responseStatus } from "../../helpers/constants";
import { BoardService } from "./board.service";
import { CreateBoardDto } from "./dto/create.dto";
import { PatchBoardDto } from "./dto/patch.dto";
import { ResponseBoardAuditDto } from "./dto/responseAudit.dto";
import { ResponseBoardDto } from "./dto/responseBoards.dto";
import { ResponseBoardWithListFieldDto } from "./dto/responseWithListField.dto";
import { CreateBoardGuard } from "./guards/create.guard";
import { GetBoardGuard } from "./guards/get.guard";

@Controller("boards")
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get(":id/audit")
  @ApiOperation({
    summary: "Get audit log",
    tags: ["Boards Endpoints"],
    description: "This endpoint returns the history of actions within the board.",
  })
  @ApiOkResponse({ type: ResponseBoardAuditDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "id",
    example: "clulefm59000108l9fnpr6w7t",
    description: "The id of the board for which you want to retrieve the audit history.",
  })
  @UseGuards(GetBoardGuard)
  getAudit(@Param("id") id: string) {
    return this.boardService.getAudit(id);
  }

  @Get()
  @ApiOperation({
    summary: "Get all the boards",
    tags: ["Boards Endpoints"],
    description: "This endpoint returns a list of all existing boards.",
  })
  @ApiOkResponse({ type: ResponseBoardWithListFieldDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  getBoards() {
    return this.boardService.getBoards();
  }

  @Post()
  @ApiOperation({
    summary: "Create a new board",
    tags: ["Boards Endpoints"],
    description: "This endpoint creates a new board in the database and returns the object of the created board.",
  })
  @ApiOkResponse({ type: ResponseBoardDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: CreateBoardDto })
  @UseGuards(CreateBoardGuard)
  createBoard(@Body() body: CreateBoardDto) {
    return this.boardService.createBoard(body);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Edit the board",
    tags: ["Boards Endpoints"],
    description: "This endpoint edits a board in the database and returns an object with the updated board.",
  })
  @ApiOkResponse({ type: ResponseBoardDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: PatchBoardDto })
  @ApiParam({ name: "id", example: "clulde05k000008jncx4qaduv", description: "The id of the board to be edited." })
  @UseGuards(GetBoardGuard, CreateBoardGuard)
  patchBoard(@Body() body: PatchBoardDto, @Param("id") id: string) {
    return this.boardService.patchBoard(body, id);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Remove the board",
    tags: ["Boards Endpoints"],
    description: "This query removes the board from the database.",
  })
  @ApiOkResponse({ description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({ name: "id", example: "cluldezu7000108jnfpb9g3s5", description: "The id of the board to be deleted." })
  @UseGuards(GetBoardGuard)
  deleteBoard(@Param("id") id: string) {
    return this.boardService.deleteBoard(id);
  }
}
