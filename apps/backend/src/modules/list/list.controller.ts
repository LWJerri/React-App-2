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
import { CreateListDto } from "./dto/create.dto";
import { PatchListDto } from "./dto/patch.dto";
import { ResponseListDto } from "./dto/response.dto";
import { ResponseListWithTaskFieldDto } from "./dto/responseWithTaskField.dto";
import { CreateListGuard } from "./guards/create.guard";
import { DeleteListGuard } from "./guards/delete.guard";
import { GetBoardListGuard } from "./guards/getBoard.guard";
import { PatchListGuard } from "./guards/patch.guard";
import { ListService } from "./list.service";

@Controller("boards/:boardId/lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  @ApiOperation({
    summary: "Get the lists",
    tags: ["Lists Endpoints"],
    description: "This endpoint returns a list of all lists in the specified board.",
  })
  @ApiOkResponse({ type: ResponseListWithTaskFieldDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "clulfeu4j000108jj6g84808l",
    description: "The id of the board for which lists are to be retrieved.",
  })
  @UseGuards(GetBoardListGuard)
  getLists(@Param("boardId") boardId: string) {
    return this.listService.getLists(boardId);
  }

  @Post()
  @ApiOperation({
    summary: "Create a list",
    tags: ["Lists Endpoints"],
    description: "This endpoint creates a new list in the database and returns an object with the new list.",
  })
  @ApiOkResponse({ type: ResponseListDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: CreateListDto })
  @ApiParam({
    name: "boardId",
    example: "clulff7ng000208jjh0vt0ecd",
    description: "The id of the board in which you want to create the list.",
  })
  @UseGuards(GetBoardListGuard, CreateListGuard)
  createList(@Body() body: CreateListDto, @Param("boardId") boardId: string) {
    return this.listService.createList(body, boardId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Edit the list",
    tags: ["Lists Endpoints"],
    description: "This endpoint edits a list in the database and returns the edited list object.",
  })
  @ApiOkResponse({ type: ResponseListDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: PatchListDto })
  @ApiParam({
    name: "boardId",
    example: "clulfgx0j000408jjfmdz8fj7",
    description: "The id of the board in which you want to edit the list.",
  })
  @ApiParam({ name: "id", example: "clulfgqi0000308jja6j594sd", description: "The id of the list to be edited." })
  @UseGuards(GetBoardListGuard, PatchListGuard, CreateListGuard)
  patchList(@Body() body: PatchListDto, @Param("boardId") boardId: string, @Param("id") id: string) {
    return this.listService.patchList(body, boardId, id);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete the list",
    tags: ["Lists Endpoints"],
    description: "This endpoint deletes the list in the database.",
  })
  @ApiOkResponse({ description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "clulfhtn0000608jjc7t011sb",
    description: "The id of the board in which you want to delete the list.",
  })
  @ApiParam({ name: "id", example: "clulfhnzr000508jjai8k7mfw", description: "The id of the list to be deleted." })
  @UseGuards(GetBoardListGuard, DeleteListGuard)
  deleteList(@Param("boardId") boardId: string, @Param("id") id: string) {
    return this.listService.deleteList(boardId, id);
  }
}
