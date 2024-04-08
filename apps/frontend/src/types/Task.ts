import { paths } from "@/api";

type RequestUrl = "/boards/{boardId}/lists/{listId}/tasks";

export type Task = paths[RequestUrl]["get"]["responses"]["200"]["content"]["application/json"][0];
