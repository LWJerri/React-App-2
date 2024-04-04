import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  OmitType,
} from "@nestjs/swagger";
import { FallbackResponse } from "src/helpers/FallbackResponse";
import { responseStatus } from "src/helpers/constants";
import { CreateListDto } from "./dto/create.dto";
import { PatchListDto } from "./dto/patch.dto";
import { ResponseListDto } from "./dto/response.dto";
import { ResponseListWithTaskFieldDto } from "./dto/responseWithTaskField.dto";
import { CreateListGuard } from "./guards/create.guard";
import { DeleteListGuard } from "./guards/delete.guard";
import { GetListGuard } from "./guards/get.guard";
import { PatchListGuard } from "./guards/patch.guard";
import { ListService } from "./list.service";

@Controller(":boardId/lists")
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  @ApiOperation({
    summary: "Get all lists",
    tags: ["Lists Endpoints"],
    description: "This endpoint returns a list of all created lists.",
  })
  @ApiOkResponse({ type: ResponseListWithTaskFieldDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "clulfeu4j000108jj6g84808l",
    description: "Specify the board Id for which you wanna get lists.",
  })
  @UseGuards(GetListGuard)
  getLists(@Param("boardId") boardId: string) {
    return this.listService.getLists(boardId);
  }

  @Post()
  @ApiOperation({
    summary: "Create a list",
    tags: ["Lists Endpoints"],
    description:
      "This endpoint creates a new list in the database with the specified parameters and returns an object with the new list.",
  })
  @ApiOkResponse({ type: OmitType(ResponseListDto, ["task"]), description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: CreateListDto })
  @ApiParam({
    name: "boardId",
    example: "clulff7ng000208jjh0vt0ecd",
    description: "Specify the board Id for which you wanna create list.",
  })
  @UseGuards(GetListGuard, CreateListGuard)
  createList(@Body() body: CreateListDto, @Param("boardId") boardId: string) {
    return this.listService.createList(body, boardId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Edit list",
    tags: ["Lists Endpoints"],
    description: "This endpoint accepts parameters to edit an existing list and returns a new list object.",
  })
  @ApiOkResponse({ type: ResponseListDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: PatchListDto })
  @ApiParam({
    name: "id",
    example: "clulfgqi0000308jja6j594sd",
    description: "Specify the Id of the list to be edited.",
  })
  @ApiParam({
    name: "boardId",
    example: "clulfgx0j000408jjfmdz8fj7",
    description: "Specify the board Id for which you wanna edit list.",
  })
  @UseGuards(GetListGuard, PatchListGuard)
  patchList(@Body() body: PatchListDto, @Param("id") id: string, @Param("boardId") boardId: string) {
    return this.listService.patchList(body, id, boardId);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete list",
    tags: ["Lists Endpoints"],
    description: "This endpoint deletes the list with all tasks bound to the list.",
  })
  @ApiOkResponse({ description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "id",
    example: "clulfhnzr000508jjai8k7mfw",
    description: "Specify the Id of the list to be deleted.",
  })
  @ApiParam({
    name: "boardId",
    example: "clulfhtn0000608jjc7t011sb",
    description: "Specify the board Id for which you wanna edit list.",
  })
  @UseGuards(GetListGuard, DeleteListGuard)
  deleteList(@Param("id") id: string, @Param("boardId") boardId: string) {
    return this.listService.deleteList(id, boardId);
  }
}
