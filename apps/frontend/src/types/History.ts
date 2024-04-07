import { paths } from "@/api";

export type History = paths["/audit"]["get"]["responses"]["200"]["content"]["application/json"][0];
