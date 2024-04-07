import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/modules/app/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let boardId: string;
  let listId: string;
  let taskId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  test("[BOARD] Should return array with boards /boards (GET)", async () => {
    const response = await request(app.getHttpServer()).get("/boards");

    return expect(response.body).toEqual(expect.any(Array));
  });

  test("[BOARD] Should create board /boards (POST)", async () => {
    const response = await request(app.getHttpServer()).post("/boards").send({ name: "test" });

    boardId = response.body.id;

    return expect(response.body).toMatchObject({ name: "test" });
  });

  test('[BOARD] Should rename "test" board to "test2" /boards/:id (PATCH)', async () => {
    const response = await request(app.getHttpServer()).patch(`/boards/${boardId}`).send({ name: "test2" });

    return expect(response.body).toMatchObject({ name: "test2" });
  });

  test("[BOARD] Should return array with board audit /boards/:id/audit (GET)", async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/audit`);

    return expect(response.body).toEqual(expect.any(Array));
  });

  test("[LIST] Should return array of lists /boards/:boardId/lists (GET)", async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/lists`);

    return expect(response.body).toEqual(expect.any(Array));
  });

  test('[LIST] Create new "test" list /boards/:boardId/lists (POST)', async () => {
    const response = await request(app.getHttpServer()).post(`/boards/${boardId}/lists`).send({ name: "test" });

    listId = response.body.id;

    return expect(response.body).toMatchObject({ name: "test" });
  });

  test('[LIST] Should rename "test" list to "test2" /boards/:boardId/lists/:id (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/boards/${boardId}/lists/${listId}`)
      .send({ name: "test2" });

    return expect(response.body).toMatchObject({ name: "test2" });
  });

  test('[LIST] Should find "CREATE" action for "test" list in board audit /boards/:boardId/audit (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/audit`);

    return expect(response.body).toContainEqual(
      expect.objectContaining({ action: "CREATE", boardId, relatedId: listId }),
    );
  });

  test('[LIST] Should find "EDIT" action for "test2" list in board audit /boards/:boardId/audit (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/audit`);

    return expect(response.body).toContainEqual(
      expect.objectContaining({ action: "EDIT", boardId, relatedId: listId }),
    );
  });

  test("[TASK] Should return array of tasks /boards/:boardId/lists/:listId/tasks (GET)", async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/lists/${listId}/tasks`);

    return expect(response.body).toEqual(expect.any(Array));
  });

  test('[TASK] Should create "test" task /boards/:boardId/lists/:listId/tasks (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post(`/boards/${boardId}/lists/${listId}/tasks`)
      .send({ name: "test", description: "Example description...", dueAt: new Date().toISOString(), priority: "LOW" });

    taskId = response.body.id;

    return expect(response.body).toMatchObject({ name: "test" });
  });

  test('[TASK] Should return "test" task audit /boards/:boardId/lists/:listId/tasks/:id/audit (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/lists/${listId}/tasks/${taskId}/audit`);

    return expect(response.body).toEqual(expect.any(Array));
  });

  test('[TASK] Should rename "test" task to "test2" task /boards/:boardId/lists/:listId/tasks/:id (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/boards/${boardId}/lists/${listId}/tasks/${taskId}`)
      .send({ name: "test2" });

    return expect(response.body).toMatchObject({ name: "test2" });
  });

  test('[TASK] Should return "test2" task object /boards/:boardId/lists/:listId/tasks/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    return expect(response.body).toMatchObject({ name: "test2", boardId, listId });
  });

  test('[TASK] Should find "CREATE" action for "test" task in board audit /boards/:boardId/audit (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/audit`);

    return expect(response.body).toContainEqual(
      expect.objectContaining({ action: "CREATE", boardId, relatedId: taskId }),
    );
  });

  test('[TASK] Should find "EDIT" action for "test2" task in board audit /boards/:boardId/audit (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/boards/${boardId}/audit`);

    return expect(response.body).toContainEqual(
      expect.objectContaining({ action: "CREATE", boardId, relatedId: taskId }),
    );
  });

  test('[TASK] Should delete "test2" task /boards/:boardId/lists/:listId/tasks/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer()).delete(`/boards/${boardId}/lists/${listId}/tasks/${taskId}`);

    return expect(response.body).toEqual({});
  });

  test('[LIST] Should delete "test2" list', async () => {
    const response = await request(app.getHttpServer()).delete(`/boards/${boardId}/lists/${listId}`);

    return expect(response.body).toEqual({});
  });

  test('[BOARD] Should delete "test2" board /boards/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer()).delete(`/boards/${boardId}`);

    return expect(response.body).toEqual({});
  });
});
