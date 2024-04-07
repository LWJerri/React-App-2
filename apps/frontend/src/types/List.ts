import { paths } from "@/api";

export type List = paths["/lists"]["get"]["responses"]["200"]["content"]["application/json"][0];
