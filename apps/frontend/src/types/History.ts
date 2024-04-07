import { paths } from "@/api";

type RequestUrl = "/boards/{id}/audit";

export type History = paths[RequestUrl]["get"]["responses"]["200"]["content"]["application/json"][0];
