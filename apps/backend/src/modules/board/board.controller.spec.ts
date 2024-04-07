import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { BoardController } from "./board.controller";
import { BoardService } from "./board.service";

describe("BoardController", () => {
  let boardController: BoardController;
  let boardId: string;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService, PrismaService],
    }).compile();

    boardController = app.get<BoardController>(BoardController);
  });

  test("Should return array with boards", async () => {
    const getAllBoards = await boardController.getBoards();

    expect(getAllBoards).toEqual(expect.any(Array));
  });

  test('Should create board with "test" name', async () => {
    const newTestBoard = await boardController.createBoard({ name: "test" });

    boardId = newTestBoard.id;

    expect(newTestBoard).toMatchObject({ name: "test" });
  });

  test("Should return array with board audit", async () => {
    const getBoardAudit = await boardController.getAudit(boardId);

    expect(getBoardAudit).toEqual(expect.any(Array));
  });

  test('Should rename board from "test" to "test2"', async () => {
    const updatedBoard = await boardController.patchBoard({ name: "test2" }, boardId);

    expect(updatedBoard).toMatchObject({ id: boardId, name: "test2" });
  });

  test('Should delete board "test2"', async () => {
    const deletedBoard = await boardController.deleteBoard(boardId);

    expect(deletedBoard).toBeUndefined();
  });
});
