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
import { FallbackResponse } from "../../helpers/FallbackResponse";
import { responseStatus } from "../../helpers/constants";
import { ResponseBoardAuditTaskDto } from "../board/dto/responseAudit.dto";
import { GetBoardListGuard } from "../list/guards/getBoard.guard";
import { CreateTaskDto } from "./dto/create.dto";
import { PatchTaskDto } from "./dto/patch.dto";
import { ResponseTaskDto } from "./dto/response.dto";
import { GetTaskGuard } from "./guards/get.guard";
import { PatchTaskGuard } from "./guards/patch.guard";
import { TaskListGuard } from "./guards/task.guard";
import { TaskService } from "./task.service";

@Controller("boards/:boardId/lists/:listId/tasks")
@UseGuards(GetBoardListGuard, TaskListGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: "Get the tasks",
    tags: ["Tasks Endpoints"],
    description: "This endpoint updates the list of all tasks assigned to the specified board and list.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "cluljfxy2000108l3fl1h9fms",
    description: "The id of the board for which the task is to be retrieved.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljfu0k000008l3g2na0xxs",
    description: "The id of the list for which the task is to be retrieved.",
  })
  getTasks(@Param("boardId") boardId: string, @Param("listId") listId: string) {
    return this.taskService.getTasks(boardId, listId);
  }

  @Get(":id/audit")
  @ApiOperation({
    summary: "History of changes",
    tags: ["Tasks Endpoints"],
    description: "This endpoint returns the change history for the specified task.",
  })
  @ApiOkResponse({
    type: OmitType(ResponseBoardAuditTaskDto, ["relatedId"]),
    isArray: true,
    description: responseStatus["success"],
  })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "cluljm763000208l3hwowdubx",
    description: "The id of the board for which you want to retrieve a list of changes to the task.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljma62000308l3621napx3",
    description: "The list id of the list for which you want to retrieve a list of changes to the task.",
  })
  @ApiParam({
    name: "id",
    example: "cluljmee4000408l36cizegkh",
    description: "The id of the task for which you want to retrieve the change list.",
  })
  @UseGuards(GetTaskGuard)
  getAudit(@Param("boardId") boardId: string, @Param("id") taskId: string) {
    return this.taskService.getAudit(boardId, taskId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get the task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint returns an object with a task.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "cluljum8z000008le778m5hvo",
    description: "The id of the board for which the task is to be obtained",
  })
  @ApiParam({
    name: "listId",
    example: "cluljuot0000108le2pwuehua",
    description: "The id of the list for which the task is to be retrieved",
  })
  @ApiParam({ name: "id", example: "cluljurao000208le92ij6366", description: "Task id." })
  @UseGuards(GetTaskGuard)
  getTask(@Param("boardId") boardId: string, @Param("listId") listId: string, @Param("id") id: string) {
    return this.taskService.getTask(boardId, listId, id);
  }

  @Post()
  @ApiOperation({
    summary: "Create a task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint creates a new task in the database and returns a task object.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: CreateTaskDto })
  @ApiParam({
    name: "boardId",
    example: "cluljw8uo000008l51nnqgpfl",
    description: "The id of the board for which you want to create a task.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljwc7w000108l55x0cavuq",
    description: "The list id of the list for which you want to create a task.",
  })
  createTask(@Body() body: CreateTaskDto, @Param("boardId") boardId: string, @Param("listId") listId: string) {
    return this.taskService.createTask(body, boardId, listId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Edit a task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint edits the task in the database and returns the updated task object.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: PatchTaskDto })
  @ApiParam({
    name: "boardId",
    example: "clulk457i000008jy8vbq59nf",
    description: "The id of the board in which you want to edit the task.",
  })
  @ApiParam({
    name: "listId",
    example: "clulk4880000108jy8py40n8z",
    description: "The list id of the list in which you want to edit the task.",
  })
  @ApiParam({ name: "id", example: "clulk4bmk000208jy2n8o3521", description: "The id of the task to be edited." })
  @UseGuards(GetTaskGuard, PatchTaskGuard)
  patchTask(
    @Body() body: PatchTaskDto,
    @Param("boardId") boardId: string,
    @Param("listId") listId: string,
    @Param("id") id: string,
  ) {
    return this.taskService.patchTask(body, boardId, listId, id);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Delete the task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint deletes a task in the database.",
  })
  @ApiOkResponse({ description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "clulk6wxu000308jy5hb78ug9",
    description: "The id of the board in which you want to delete the task.",
  })
  @ApiParam({
    name: "listId",
    example: "clulk6zwj000408jyh8rz4vry",
    description: "The id of the list in which you want to delete the task.",
  })
  @ApiParam({ name: "id", example: "clulk72qn000508jy9x7457ep", description: "The id of the task to be deleted." })
  @UseGuards(GetTaskGuard)
  deleteTask(@Param("boardId") boardId: string, @Param("listId") listId: string, @Param("id") id: string) {
    return this.taskService.deleteTask(boardId, listId, id);
  }
}
