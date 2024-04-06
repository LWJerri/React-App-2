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
    description: "This request will return the entire history of actions on lists and tasks.",
  })
  @ApiOkResponse({ type: ResponseBoardAuditDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "id",
    example: "clulefm59000108l9fnpr6w7t",
    description: "Provide board Id which you want to get audit.",
  })
  @UseGuards(GetBoardGuard)
  getAudit(@Param("id") boardId: string) {
    return this.boardService.getAudit(boardId);
  }

  @Get()
  @ApiOperation({
    summary: "Get all boards",
    tags: ["Boards Endpoints"],
    description: "This endpoint returns a list of all created boards.",
  })
  @ApiOkResponse({ type: ResponseBoardWithListFieldDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  getBoards() {
    return this.boardService.getBoards();
  }

  @Post()
  @ApiOperation({
    summary: "Create a board",
    tags: ["Boards Endpoints"],
    description:
      "This endpoint creates a new board in the database with the specified parameters and returns an object with the new board.",
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
    summary: "Edit board",
    tags: ["Boards Endpoints"],
    description: "This endpoint accepts parameters to edit an existing board and returns a new board object.",
  })
  @ApiOkResponse({ type: ResponseBoardDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: PatchBoardDto })
  @ApiParam({
    name: "id",
    example: "clulde05k000008jncx4qaduv",
    description: "Specify the Id of the board to be edited.",
  })
  @UseGuards(GetBoardGuard, CreateBoardGuard)
  patchBoard(@Body() body: PatchBoardDto, @Param("id") id: string) {
    return this.boardService.patchBoard(body, id);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete board",
    tags: ["Boards Endpoints"],
    description: "This endpoint deletes the board with all lists bound to the board.",
  })
  @ApiOkResponse({ description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "id",
    example: "cluldezu7000108jnfpb9g3s5",
    description: "Specify the Id of the board to be deleted.",
  })
  @UseGuards(GetBoardGuard)
  deleteBoard(@Param("id") id: string) {
    return this.boardService.deleteBoard(id);
  }
}
