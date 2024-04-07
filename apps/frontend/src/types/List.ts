import { paths } from "@/api";

type RequestUrl = "/boards/{boardId}/lists";

export type List = paths[RequestUrl]["get"]["responses"]["200"]["content"]["application/json"][0];
