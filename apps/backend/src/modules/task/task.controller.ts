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
    description: "This endpoint will return a list of all created tasks for the specified list.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, isArray: true, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "cluljfxy2000108l3fl1h9fms",
    description: "Specify the board Id for which you want to retrieve tasks.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljfu0k000008l3g2na0xxs",
    description: "Specify the list Id for which you want to retrieve tasks.",
  })
  getTasks(@Param("boardId") boardId: string, @Param("listId") listId: string) {
    return this.taskService.getTasks(boardId, listId);
  }

  @Get(":id/audit")
  @ApiOperation({
    summary: "History of changes",
    tags: ["Tasks Endpoints"],
    description: "This endpoint will return a list of all changes that are associated with the specified task.",
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
    description: "Specify the board Id for which you want to get audit log.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljma62000308l3621napx3",
    description: "Specify the list Id for which you want to get audit log..",
  })
  @ApiParam({
    name: "id",
    example: "cluljmee4000408l36cizegkh",
    description: "Specify the task Id for which you want to get audit log.",
  })
  @UseGuards(GetTaskGuard)
  getAudit(@Param("boardId") boardId: string, @Param("id") taskId: string) {
    return this.taskService.getAudit(boardId, taskId);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get the task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint will return an object with detailed information about a specific task.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "cluljum8z000008le778m5hvo",
    description: "Specify the board Id for which you want to retrieve task.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljuot0000108le2pwuehua",
    description: "Specify the list Id for which you want to retrieve task.",
  })
  @ApiParam({
    name: "id",
    example: "cluljurao000208le92ij6366",
    description: "Specify the task Id for which you want to retrieve task.",
  })
  @UseGuards(GetTaskGuard)
  getTask(@Param("boardId") boardId: string, @Param("listId") listId: string, @Param("id") id: string) {
    return this.taskService.getTask(boardId, listId, id);
  }

  @Post()
  @ApiOperation({
    summary: "Create a task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint accepts parameters to create a task and returns an object with the created task.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: CreateTaskDto })
  @ApiParam({
    name: "boardId",
    example: "cluljw8uo000008l51nnqgpfl",
    description: "Specify the board Id for which you want to create new task.",
  })
  @ApiParam({
    name: "listId",
    example: "cluljwc7w000108l55x0cavuq",
    description: "Specify the list Id for which you want to create new task.",
  })
  createTask(@Body() body: CreateTaskDto, @Param("boardId") boardId: string, @Param("listId") listId: string) {
    return this.taskService.createTask(body, boardId, listId);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Edit task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint accepts parameters to edit an existing task and returns a new object.",
  })
  @ApiOkResponse({ type: ResponseTaskDto, description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiBody({ type: PatchTaskDto })
  @ApiParam({
    name: "boardId",
    example: "clulk457i000008jy8vbq59nf",
    description: "Specify the board Id for which you want to modify.",
  })
  @ApiParam({
    name: "listId",
    example: "clulk4880000108jy8py40n8z",
    description: "Specify the list Id for which you want to modify.",
  })
  @ApiParam({
    name: "id",
    example: "clulk4bmk000208jy2n8o3521",
    description: "Specify the task Id for which you want to modify.",
  })
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
    summary: "Delete task",
    tags: ["Tasks Endpoints"],
    description: "This endpoint removes the task from the database.",
  })
  @ApiOkResponse({ description: responseStatus["success"] })
  @ApiBadRequestResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiInternalServerErrorResponse({ type: FallbackResponse, description: responseStatus["error"] })
  @ApiParam({
    name: "boardId",
    example: "clulk6wxu000308jy5hb78ug9",
    description: "Specify the board Id for which you want to delete.",
  })
  @ApiParam({
    name: "listId",
    example: "clulk6zwj000408jyh8rz4vry",
    description: "Specify the list Id for which you want to delete.",
  })
  @ApiParam({
    name: "id",
    example: "clulk72qn000508jy9x7457ep",
    description: "Specify the task Id for which you want to delete.",
  })
  @UseGuards(GetTaskGuard)
  deleteTask(@Param("boardId") boardId: string, @Param("listId") listId: string, @Param("id") id: string) {
    return this.taskService.deleteTask(boardId, listId, id);
  }
}
