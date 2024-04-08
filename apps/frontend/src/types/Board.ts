import { paths } from "@/api";

type RequestUrl = "/boards";

export type Board = paths[RequestUrl]["get"]["responses"]["200"]["content"]["application/json"][0];
