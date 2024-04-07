import { Test, TestingModule } from "@nestjs/testing";
import { AuditService } from "../audit/audit.service";
import { BoardController } from "../board/board.controller";
import { BoardService } from "../board/board.service";
import { ListController } from "../list/list.controller";
import { ListService } from "../list/list.service";
import { PrismaService } from "../prisma/prisma.service";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

describe("TaskController", () => {
  let boardController: BoardController;
  let listController: ListController;
  let taskController: TaskController;

  let boardId: string;
  let listId: string;
  let taskId: string;

  beforeAll(async () => {
    const boardApp: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService, PrismaService],
    }).compile();

    boardController = boardApp.get<BoardController>(BoardController);
    const { id: prepBoardId } = await boardController.createBoard({ name: "test" });

    boardId = prepBoardId;

    const ListApp: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [ListService, PrismaService, AuditService],
    }).compile();

    listController = ListApp.get<ListController>(ListController);
    const { id: prepListId } = await listController.createList({ name: "test" }, prepBoardId);

    listId = prepListId;
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, PrismaService, AuditService],
    }).compile();

    taskController = app.get<TaskController>(TaskController);
  });

  test("Should return array with tasks", async () => {
    const getAllTasks = await taskController.getTasks(boardId, listId);

    expect(getAllTasks).toEqual(expect.any(Array));
  });

  test('Should create "test" task', async () => {
    const createdTask = await taskController.createTask(
      {
        name: "test",
        description: "Some description...",
        dueAt: new Date().toISOString(),
        priority: "LOW",
      },
      boardId,
      listId,
    );

    taskId = createdTask.id;

    expect(createdTask).toMatchObject({ name: "test" });
  });

  test('Should find object in array with "CREATE" action for "test" task', async () => {
    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toContainEqual(expect.objectContaining({ action: "CREATE", boardId, relatedId: taskId }));
  });

  test('Should rename "test" task to "test2"', async () => {
    const updatedTask = await taskController.patchTask({ name: "test2", listId }, boardId, listId, taskId);

    expect(updatedTask).toMatchObject({ name: "test2", id: taskId });
  });

  test('Should find object in array with "EDIT" action for "test2" task', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toContainEqual(expect.objectContaining({ action: "EDIT", boardId, relatedId: taskId }));
  });

  test('Should return "test2" task object', async () => {
    const getTask = await taskController.getTask(boardId, listId, taskId);

    expect(getTask).toMatchObject({ name: "test2", boardId, listId });
  });

  test('Should return array of audit for "test2" task', async () => {
    const getTaskAudit = await taskController.getAudit(boardId, taskId);

    expect(getTaskAudit).toEqual(expect.any(Array));
  });

  test('Should delete "test2" task', async () => {
    const deletedTask = await taskController.deleteTask(boardId, listId, taskId);

    expect(deletedTask).toBeUndefined();
  });

  test('Should find object in array with "DELETE" action for "test2" task', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toContainEqual(expect.objectContaining({ action: "DELETE", boardId, relatedId: taskId }));
  });

  afterAll(async () => await boardController.deleteBoard(boardId));
});
