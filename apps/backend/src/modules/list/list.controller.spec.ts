import { Test, TestingModule } from "@nestjs/testing";
import { AuditService } from "../audit/audit.service";
import { BoardController } from "../board/board.controller";
import { BoardService } from "../board/board.service";
import { PrismaService } from "../prisma/prisma.service";
import { ListController } from "./list.controller";
import { ListService } from "./list.service";

describe("ListController", () => {
  let boardController: BoardController;
  let listController: ListController;

  let boardId: string;
  let listId: string;

  beforeAll(async () => {
    const boardApp: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService, PrismaService],
    }).compile();

    boardController = boardApp.get<BoardController>(BoardController);

    const { id } = await boardController.createBoard({ name: "test" });

    boardId = id;
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [ListService, PrismaService, AuditService],
    }).compile();

    listController = app.get<ListController>(ListController);
  });

  test("Should return array with lists", async () => {
    const getAllLists = await listController.getLists(boardId);

    expect(getAllLists).toEqual(expect.any(Array));
  });

  test('Should create new list with "test" name', async () => {
    const createdList = await listController.createList({ name: "test" }, boardId);

    listId = createdList.id;

    expect(createdList).toMatchObject({ name: "test", boardId });
  });

  test('Should find object in array with "CREATE" action for "test" list', async () => {
    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toContainEqual(expect.objectContaining({ action: "CREATE", boardId, relatedId: listId }));
  });

  test('Should rename "test" list to "test2"', async () => {
    const updatedList = await listController.patchList({ name: "test2" }, boardId, listId);

    expect(updatedList).toMatchObject({ name: "test2", id: listId });
  });

  test('Should find object in array with "EDIT" action for "test2" list', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toContainEqual(expect.objectContaining({ action: "EDIT", boardId, relatedId: listId }));
  });

  test('Should delete "test2" list', async () => {
    const deletedList = await listController.deleteList(boardId, listId);

    expect(deletedList).toBeUndefined();
  });

  test('Should find object in array with "DELETE" action for "test2" list', async () => {
    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toContainEqual(expect.objectContaining({ action: "DELETE", boardId, relatedId: listId }));
  });

  afterAll(async () => await boardController.deleteBoard(boardId));
});
